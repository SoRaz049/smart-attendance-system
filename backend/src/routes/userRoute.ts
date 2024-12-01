import express from "express";
import {
  getUserInfo,
  loginUser,
  signupUser,
} from "../controllers/userController";
import { authChecker } from "../middlewares/authChecker";

const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", signupUser);

router.get("/loggedin-user", authChecker, getUserInfo);

export default router;
