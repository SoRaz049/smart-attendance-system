import express, { Request, Response } from "express";
import { Student } from "@/models/studentModel";
import { Attendance } from "@/models/attendanceModel";

// POST request to create
export const newAttendance = async (req: Request, res: Response) => {
  const { studentId, date, isLate } = req.body;
  console.log(studentId);
  if (!studentId) {
    return res.status(400).json({ message: "Student ID is required" });
  }

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const now = new Date();
    const currentTime = now.toTimeString().split(" ")[0];
    const today = new Date(date).setHours(0, 0, 0, 0);

    const existingAttendance = await Attendance.findOne({
      student: student._id,
      date: today,
    });

    if (existingAttendance) {
      return res.status(400).json({
        message: "Attendance already marked for today",
        student: {
          _id: student._id,
          name: student.name,
          idNumber: student.idNumber,
          course: student.course,
        },
      });
    }

    const newAttendance = await Attendance.create({
      student: student._id,
      date: today,
      time: currentTime,
      isLate,
    });
    console.log(newAttendance);

    return res.status(201).json({
      attendance: newAttendance,
      student: {
        _id: student._id,
        name: student.name,
        idNumber: student.idNumber,
        course: student.course,
      },
    });
  } catch (error: any) {
    console.error("Error marking attendance:", error);
    return res.status(500).json({
      message: "Error marking attendance",
      error: error.message,
    });
  }
};

export const getStudentAttendance = async (req: Request, res: Response) => {
  const { studentId } = req.params;

  if (!studentId) {
    return res.status(400).json({ message: "Student ID is required" });
  }

  try {
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const currentDate = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(currentDate.getFullYear() - 1);

    const attendanceRecords = await Attendance.find({
      student: studentId,
      date: {
        $gte: oneYearAgo,
        $lte: currentDate,
      },
    });

    const attendanceData = attendanceRecords.map((record) => ({
      date: record.date.toISOString().split("T")[0],
      attendance: record.isLate ? 1 : 2,
    }));
    console.log(attendanceData);
    return res.status(200).json({
      student: {
        id: student._id,
        name: student.name,
      },
      totalDays: attendanceData.length,
      presentDays: attendanceData.filter((r) => r.attendance === 2).length,
      lateDays: attendanceData.filter((r) => r.attendance === 1).length,
      attendanceData,
    });
  } catch (error: any) {
    console.error("Error fetching attendance:", error);
    return res.status(500).json({
      message: "Error fetching attendance records",
      error: error.message,
    });
  }
};

// Get total attendance of one day.
export const getTotalAttendance = async (req: Request, res: Response) => {
  const { date } = req.params;
  try {
    const attendanceRecords = await Attendance.find({
      date: date,
    });
    return res.status(200).json(attendanceRecords);
  } catch (error: any) {
    console.error("Error fetching attendance:", error);
    return res.status(500).json({
      message: "Error fetching attendance records",
      error: error.message,
    });
  }
};

//get attendance of class
export const getAttendanceOfClass = async (req: Request, res: Response) => {
  const { classId } = req.params;
};
