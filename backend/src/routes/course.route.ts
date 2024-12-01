import { createCourse, getAllCourses } from "@/controllers/course.controller";
import express from "express";

const Router = express.Router();

Router.post("/", createCourse);
Router.get("/", getAllCourses);

export default Router;
