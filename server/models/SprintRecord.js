import mongoose from "mongoose";

const sprintRecordSchema = new mongoose.Schema(
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
    duration: {
      type: Number,
      required: true,
      enum: [30, 60, 120],
      index: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },
    attempts: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

export const SprintRecord = mongoose.model("SprintRecord", sprintRecordSchema);
