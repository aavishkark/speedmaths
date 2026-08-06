import { SprintRecord } from "../models/SprintRecord.js";
import { TopicStat } from "../models/TopicStat.js";
import { User } from "../models/User.js";

// @desc    Submit a sprint result
// @route   POST /api/sprint/submit
export const submitSprint = async (req, res, next) => {
  try {
    const { topicId, duration, score, attempts } = req.body;
    const userId = req.user._id;

    if (!topicId || !duration || score === undefined || !attempts) {
      return res.status(400).json({
        success: false,
        message: "topicId, duration, score, and attempts are required.",
      });
    }

    // Create sprint record
    const record = await SprintRecord.create({
      user: userId,
      topicId,
      duration: Number(duration),
      score: Number(score),
      attempts: Number(attempts),
    });

    // Update topic stat best score
    let topicStat = await TopicStat.findOne({ user: userId, topicId });
    if (!topicStat) {
      topicStat = new TopicStat({ user: userId, topicId });
    }

    const currentBests = topicStat.bestSprintScores || new Map();
    const currentBest = currentBests.get
      ? currentBests.get(String(duration)) || 0
      : currentBests[String(duration)] || 0;

    const isNewBest = score > currentBest;
    if (isNewBest) {
      if (currentBests.set) currentBests.set(String(duration), score);
      else currentBests[String(duration)] = score;
      topicStat.bestSprintScores = currentBests;
      await topicStat.save();
    }

    // Award XP
    const earnedXp = 50 + score * 5;
    const user = await User.findById(userId);
    user.xp = (user.xp || 0) + earnedXp;
    await user.save();

    res.status(201).json({
      success: true,
      record,
      isNewBest,
      earnedXp,
      user: user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get top sprint leaderboard
// @route   GET /api/sprint/leaderboard
export const getLeaderboard = async (req, res, next) => {
  try {
    const { topicId = "multiplication", duration = 60 } = req.query;

    const records = await SprintRecord.find({
      topicId,
      duration: Number(duration),
    })
      .sort({ score: -1, createdAt: 1 })
      .limit(20)
      .populate("user", "name color targetExam xp");

    res.json({
      success: true,
      leaderboard: records,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get top XP leaderboard
// @route   GET /api/sprint/leaderboard/xp
export const getXpLeaderboard = async (req, res, next) => {
  try {
    const { targetExam } = req.query;
    const filter = {};
    if (targetExam) {
      filter.targetExam = targetExam;
    }

    const topUsers = await User.find(filter)
      .sort({ xp: -1 })
      .limit(25)
      .select("name color targetExam xp dayStreak");

    res.json({
      success: true,
      leaderboard: topUsers,
    });
  } catch (error) {
    next(error);
  }
};
