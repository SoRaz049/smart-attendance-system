//@ts-nocheck
import jwt from "jsonwebtoken";
import { User } from "../models/userModel";

export const authChecker = async (req: any, res: any, next: any) => {
  const authToken = req.cookies.token;
  console.log("Auth Token:", authToken);

  if (!authToken) {
    return res.status(403).json({ message: "Please Login" });
  }

  try {
    const decodedData = jwt.verify(authToken, process.env.JWT_SECRET as string);
    if (!decodedData) {
      return res.status(500).json({ message: "Failed to decode user Token" });
    }

    const dbUser = await User.findById(decodedData.id);

    if (!dbUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const filteredUser = dbUser.toObject();
    delete filteredUser.password;

    req.user = filteredUser;

    next();
  } catch (error) {
    console.log(error);

    return res.status(403).json({ message: "Internal Server Error" });
  }
};
