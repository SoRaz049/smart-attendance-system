import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    idNumber: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      required: true,
      default: "A",
    },
    course: {
      type: String,
      required: true,
    },
    batch: {
      type: Number,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    photoUrl: {
      type: String,
      required: true,
    },
    guardianName: {
      type: String,
      required: true,
    },
    guardianContact: {
      type: String,
      required: true,
    },
    faceRegistered: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Student = mongoose.model("Student", StudentSchema);
