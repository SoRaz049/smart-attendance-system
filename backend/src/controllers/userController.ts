import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { User } from "../models/userModel";
import { create } from "domain";
import { Role } from "../models/administration/roleModel";

// Generate JWT token
const generateToken = (id: any) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("Jwt secret is not available");
  }

  const token = jwt.sign({ id }, secret);
  return token;
};

const verifyToken = (token: any) => {
  try {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("Jwt secret is not available");
    }
    const verified = jwt.verify(token, secret);
    return verified;
  } catch (err: any) {
    console.log("Invalid Token");
    if (err.message) {
      console.log(err.message);
    }
    return false;
  }
};

export const signupUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .json({ message: "Email and Password are required" })
        .status(400);
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.json({ message: "Email already exists" }).status(409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await User.create({
      email,
      password: hashedPassword,
    });
    const filteredUser: any = createdUser.toObject();

    delete filteredUser.password;

    return res.status(200).json(filteredUser);
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and Password are required" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    return res.status(400).json({ message: "Incorrect Password" });
  }

  const loggedInUser = await User.findOne({ email }).select("-password");

  const token = generateToken(user._id.toString());

  return res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 2592000000),
    })
    .json({ user: loggedInUser });
};

export const getUserInfo = async (req: Request, res: Response) => {
  const user = req.user;
  try {
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err: any) {
    console.error("Error fetching user info: ", err);
    return res.status(400).json({ message: err.message });
  }
};
