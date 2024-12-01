import { NextFunction, Request, Response } from "express";
import { Role } from "../models/administration/roleModel";
import { User } from "../models/userModel";

export const checkPermission = (module: string, action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("Check Permission: ", module, action);
      const userRole = req.user?.roleId.toString();

      if (!userRole) {
        return res
          .status(403)
          .json({ message: "Access Denied: No Role Found" });
      }

      const roleDoc = await Role.findById(userRole);

      if (!roleDoc) {
        console.log("no role doc");
        return res.status(403).json({ message: "User's Role not found" });
      }
      if (roleDoc.name === "Master") {
        next();
        return;
      }

      const hasPermission = roleDoc.permissions.some((permission: any) => {
        return (
          permission.module === module && permission.actions.includes(action)
        );
      });

      if (!hasPermission) {
        return res.status(403).json({
          message:
            "Access Denied. You do not have permission to perform this action",
        });
      }
      next();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
};

export const adminChecker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    console.log(user._id);
    if (!user || !user._id) {
      return res.status(403).json({ message: "Not Authenticated" });
    }

    const userDoc = await User.findById(user._id);

    if (!userDoc) {
      return res.status(403).json({ message: "User not found" });
    }
    console.log(userDoc);
    if (userDoc.role != "Admin" && userDoc.role != "Master") {
      return res.status(403).json({ message: "Access Denied: Admins only" });
    }
    console.log("Next Admin Checker");
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const masterChecker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (!user || !user.id) {
      return res.status(403).json({ message: "Not Authenticated" });
    }

    const userDoc = await User.findById(user.id);

    if (!userDoc) {
      return res.status(403).json({ message: "User not found" });
    }

    if (userDoc.role !== "Master") {
      return res
        .status(403)
        .json({ message: 'Forbidden. Only for "Master" role' });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};
