import {
  createFaceEmbedding,
  exportFaceEmbeddingsToCSV,
} from "@/controllers/faceEmbeddingController";
import express from "express";

const Router = express.Router();

Router.post("/", createFaceEmbedding);
Router.get("/export", exportFaceEmbeddingsToCSV);

export default Router;
