import express from "express";
import {
  getAllUsers,
  getProfile,
  login,
  register,
  updateProfile,
} from "../controllers/authControllers.js";
import { protect } from "../middleware/auth.js";

const authRoutes = express.Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.get("/profile", protect, getProfile);
authRoutes.put("/profile", protect, updateProfile);
authRoutes.get("/users", protect, getAllUsers);

export default authRoutes;
