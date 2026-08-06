import { User } from "../models/User.js";

// @desc    Register a new user
// @route   POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, username, password, color, targetExam, dailyGoal } = req.body;

    if (!name || !username || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, username, and password or PIN.",
      });
    }

    const cleanUsername = username.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await User.findOne({ username: cleanUsername });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username is already taken. Please choose another.",
      });
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      username: cleanUsername,
      password,
      color: color || "#3b82f6",
      targetExam: targetExam || "CAT (IIMs)",
      dailyGoal: Number(dailyGoal) || 50,
      xp: 0,
      dayStreak: 1,
    });

    const token = user.generateAuthToken();

    res.status(201).json({
      success: true,
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user & return JWT token
// @route   POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both username and password/PIN.",
      });
    }

    const cleanUsername = username.trim().toLowerCase();

    // Find user by username
    const user = await User.findOne({ username: cleanUsername });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    // Check password match
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    const token = user.generateAuthToken();

    res.json({
      success: true,
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      user: req.user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile settings
// @route   PUT /api/auth/profile
export const updateProfile = async (req, res, next) => {
  try {
    const { name, color, targetExam, dailyGoal } = req.body;
    const user = req.user;

    if (name) user.name = name.trim();
    if (color) user.color = color;
    if (targetExam) user.targetExam = targetExam;
    if (dailyGoal) user.dailyGoal = Number(dailyGoal);

    await user.save();

    res.json({
      success: true,
      user: user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};
