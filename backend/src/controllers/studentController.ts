import { Student } from "@/models/studentModel";
import { Request, Response } from "express";
import { SortOrder } from "mongoose";

export const createStudent = async (req: Request, res: Response) => {
  const {
    name,
    idNumber,
    email,
    phone,
    section,
    courseRef,
    batch,
    dateOfBirth,
    contactNo,
    photoUrl,
    guardianName,
    guardianContact,
  } = req.body;

  console.log("Request Body: ", req.body);
  try {
    const existingStudent = await Student.findOne({
      $or: [{ idNumber }, { email }],
    });
    if (existingStudent) {
      return res
        .status(400)
        .json({ message: "Student with this ID or email already exists" });
    }

    const newStudent = await Student.create({
      name,
      idNumber,
      email,
      phone,
      section,
      courseRef,
      batch,
      dateOfBirth,
      contactNo,
      photoUrl,
      guardianName,
      guardianContact,
    });

    if (!newStudent) {
      return res.status(500).json({ message: "Error creating student" });
    }
    console.log("New Student: ", newStudent);

    return res.status(201).json(newStudent);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error creating student",
      error: error.message,
    });
  }
};
export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const { section, course, batch, sortField, sortOrder = "asc" } = req.body;

    const filters: Record<string, any> = {};
    if (section) filters.section = section;
    if (course) filters.courseRef = course;
    if (batch) filters.batch = batch;

    const sortOptions: { [key: string]: SortOrder } = {};
    if (sortField) {
      sortOptions[sortField] = sortOrder === "desc" ? -1 : (1 as SortOrder);
    }

    const students = await Student.find(filters)
      .sort(sortOptions)
      .populate("courseRef");

    if (!students.length) {
      return res.status(404).json({ message: "No students found." });
    }

    return res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const getStudentById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const student = await Student.findById(id).populate("courseRef");
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }
    return res.status(200).json(student);
  } catch (error) {
    console.error("Error fetching student:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
