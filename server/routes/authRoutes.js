import express from "express";
import {
  getMe,
  login,
  register,
  updateProfile,
} from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, getMe);
router.put("/profile", requireAuth, updateProfile);

export default router;
