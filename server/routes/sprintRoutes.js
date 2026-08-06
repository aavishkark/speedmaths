import express from "express";
import {
  getLeaderboard,
  getXpLeaderboard,
  submitSprint,
} from "../controllers/sprintController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Public leaderboard routes
router.get("/leaderboard", getLeaderboard);
router.get("/leaderboard/xp", getXpLeaderboard);

// Authenticated sprint submission
router.post("/submit", requireAuth, submitSprint);

export default router;
