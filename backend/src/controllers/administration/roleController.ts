import { Role } from "@/models/administration/roleModel";
import { User } from "@/models/userModel";
import { sendUpdatedRole } from "@/routes/administration/roleRoute";
import { Request, Response } from "express";

export const getAllRoles = async (req: Request, res: Response) => {
  const user = req.user;

  try {
    let roles = await Role.find({ name: { $ne: "Master" } }).sort({
      permissions: -1,
    });

    if (!roles || roles.length === 0) {
      return res.status(404).json({ message: "No roles found" });
    }

    if (user.role != "Master") {
      roles = roles.filter((role) => role.name != "Admin");
    }

    res.status(200).json(roles);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getAllRolesWithAdmin = async (req: Request, res: Response) => {
  try {
    let roles = await Role.find({ name: { $ne: "Master" } }).sort({
      permissions: -1,
    });

    if (!roles || roles.length === 0) {
      return res.status(404).json({ message: "No roles found" });
    }

    res.status(200).json(roles);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createRole = async (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  try {
    const duplicateData = await Role.findOne({ name });
    if (duplicateData) {
      return res.status(409).json({ message: `Role:${name} already Exists` });
    }

    const newRole = await Role.create({ name, permissions: [] });
    const roleDoc = await Role.find({ name: { $ne: "Master" } }).sort({
      permissions: -1,
    });
    if (roleDoc) {
      sendUpdatedRole(roleDoc);
    }
    return res.status(201).json(newRole);
  } catch (error) {
    return res.status(500).json({ message: "Error creating role", error });
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  const { roleId } = req.params;
  const user = req.user;

  try {
    const role = await Role.findById(roleId);
    console.log(roleId);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    if (role.name === "Admin" || user.role === "Master") {
      return res
        .status(403)
        .json({ message: "Cannot Delete Admin and Master roles" });
    }
    if (role.name === "User") {
      return res.status(403).json({ message: "Cannot Delete User role" });
    }

    const isUserAssociated = await User.find({ roleId });
    console.log("Is user associated:", isUserAssociated);
    if (isUserAssociated.length > 0) {
      return res.status(400).json({
        message: "Cannot delete role, Users are associated with this role",
      });
    }

    const response = await Role.findByIdAndDelete(roleId);
    console.log(response);
    const roleDoc = await Role.find({ name: { $ne: "Master" } }).sort({
      permissions: -1,
    });
    if (roleDoc) {
      sendUpdatedRole(roleDoc);
    }

    return res.status(200).json({ message: "Role deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting role", error });
  }
};

export const updateRole = async (req: Request, res: Response) => {
  const { roleId } = req.params;
  const { permissions } = req.body;
  const user = req.user;

  if (!Array.isArray(permissions)) {
    return res.status(400).json({ message: "Permissions should be an array" });
  }

  try {
    const roleDoc = await Role.findById(roleId);
    if (!roleDoc) {
      return res.status(404).json({ message: "Role not found" });
    }

    if (roleDoc.name === "Admin" && user.role != "Master") {
      return res.status(403).json({ message: "Only Master can modify Admin" });
    }

    roleDoc.permissions.splice(0, roleDoc.permissions.length);

    permissions.forEach((permission) => {
      roleDoc.permissions.push(permission);
    });

    roleDoc.save();

    let updatedRoleDoc = await Role.find({ name: { $ne: "Master" } }).sort({
      permissions: -1,
    });
    if (user.role != "Master") {
      updatedRoleDoc = updatedRoleDoc.filter((role) => role.name != "Admin");
    }
    if (updatedRoleDoc) {
      console.log("Sending");
      sendUpdatedRole(updatedRoleDoc);
    }

    return res
      .status(200)
      .json({ message: "Permissions updated successfully", roleDoc });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error updating permissions", error });
  }
};

export const getUserRole = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const role = await Role.findOne({ name: user.role });
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    return res.status(200).json(role);
  } catch (error) {
    console.log("Error fetching role: ", error);
    return res.status(500).json({ message: "Error fetching user role" });
  }
};
