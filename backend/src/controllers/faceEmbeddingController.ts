import { FaceEmbedding } from "@/models/faceEmbeddingModel";
import { Request, Response } from "express";
import { createObjectCsvWriter } from "csv-writer";
import path from "path";
import fs from "fs";
import { pipeline } from "stream";
import { promisify } from "util";
import { Student } from "@/models/studentModel";

const pipelineAsync = promisify(pipeline);

export const createFaceEmbedding = async (req: Request, res: Response) => {
  const { studentId, faceEmbedding } = req.body;
  try {
    if (!studentId || !faceEmbedding) {
      return res
        .status(400)
        .json({ error: "Student ID and face embedding are required" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const existingFaceEmbedding = await FaceEmbedding.findOne({ studentId });
    if (existingFaceEmbedding) {
      return res
        .status(400)
        .json({ error: "Face embedding already exists for this student" });
    }

    const newFaceEmbedding = new FaceEmbedding({
      studentId,
      faceEmbedding,
    });
    await newFaceEmbedding.save();
    res.status(201).json(newFaceEmbedding);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const exportFaceEmbeddingsToCSV = async (
  req: Request,
  res: Response
) => {
  try {
    const faceEmbeddings = await FaceEmbedding.find();

    const exportDir = path.join(__dirname, "../../exports");
    const csvFilePath = path.join(exportDir, "face_embeddings.csv");

    // Ensure the export directory exists
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    const csvWriter = createObjectCsvWriter({
      path: csvFilePath,
      header: [
        { id: "studentId", title: "Student ID" },
        { id: "faceEmbedding", title: "Face Embedding" },
      ],
    });

    const records = faceEmbeddings.map((embedding) => ({
      studentId: embedding.studentId.toString(),
      faceEmbedding: embedding.faceEmbedding.join(" "),
    }));

    await csvWriter.writeRecords(records);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=face_embeddings.csv"
    );

    const fileStream = fs.createReadStream(csvFilePath);
    await pipelineAsync(fileStream, res);

    fs.unlink(csvFilePath, (err) => {
      if (err) console.error("Failed to delete CSV file:", err);
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
