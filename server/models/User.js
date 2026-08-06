import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
    },
    password: {
      type: String,
      required: [true, "Password or PIN is required"],
      minlength: [4, "Password or PIN must be at least 4 characters"],
    },
    color: {
      type: String,
      default: "#3b82f6",
    },
    targetExam: {
      type: String,
      default: "CAT (IIMs)",
    },
    dailyGoal: {
      type: Number,
      default: 50,
      min: [10, "Daily goal must be at least 10"],
      max: [500, "Daily goal cannot exceed 500"],
    },
    dailyProgress: {
      date: { type: String, default: () => new Date().toISOString().slice(0, 10) },
      count: { type: Number, default: 0 },
    },
    xp: {
      type: Number,
      default: 0,
      min: 0,
    },
    dayStreak: {
      type: Number,
      default: 1,
      min: 1,
    },
    lastActiveDate: {
      type: String,
      default: () => new Date().toISOString().slice(0, 10),
    },
  },
  {
    timestamps: true,
  },
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { id: this._id, username: this.username, name: this.name },
    process.env.JWT_SECRET || "speedmaths_jwt_fallback_secret",
    { expiresIn: process.env.JWT_EXPIRES_IN || "30d" },
  );
};

// Return sanitized user JSON
userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = mongoose.model("User", userSchema);
