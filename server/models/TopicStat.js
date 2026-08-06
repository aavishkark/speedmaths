import mongoose from "mongoose";

const topicStatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    topicId: {
      type: String,
      required: true,
      index: true,
    },
    attempts: {
      type: Number,
      default: 0,
      min: 0,
    },
    correct: {
      type: Number,
      default: 0,
      min: 0,
    },
    streak: {
      type: Number,
      default: 0,
      min: 0,
    },
    bestStreak: {
      type: Number,
      default: 0,
      min: 0,
    },
    missedFactIds: {
      type: [String],
      default: [],
    },
    bestSprintScores: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

// Ensure one record per user per topic
topicStatSchema.index({ user: 1, topicId: 1 }, { unique: true });

export const TopicStat = mongoose.model("TopicStat", topicStatSchema);
