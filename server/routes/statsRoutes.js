import express from "express";
import {
  getUserStats,
  recordAttempt,
  resetTopic,
  syncOfflineProgress,
} from "../controllers/statsController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.use(requireAuth); // All stats routes require authentication

router.get("/", getUserStats);
router.post("/attempt", recordAttempt);
router.post("/sync", syncOfflineProgress);
router.delete("/:topicId", resetTopic);

export default router;
