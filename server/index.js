import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from server directory or root
dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config({ path: path.join(__dirname, "../.env") });

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import sprintRoutes from "./routes/sprintRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan("dev"));

// Health Check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "SpeedMaths API",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/sprint", sprintRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`SpeedMaths Server running on http://localhost:${PORT}`);
});
