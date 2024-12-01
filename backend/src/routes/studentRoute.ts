import {
  createStudent,
  getAllStudents,
  getStudentById,
} from "@/controllers/studentController";
import express from "express";

const Router = express.Router();
export default Router;

Router.post("/", createStudent);
Router.get("/", getAllStudents);
Router.get("/:id", getStudentById);
