import { Request, Response } from "express";
import { Course } from "../models/courseModel";
import { handleError } from "../utils/errorHandler";

export const createCourse = async (req: Request, res: Response) => {
  try {
    const courseData = req.body;
    const newCourse = new Course(courseData);
    const savedCourse = await newCourse.save();

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: savedCourse,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const courses = await Course.find();
    return res.status(200).json(courses);
  } catch (error) {
    handleError(res, error);
  }
};
