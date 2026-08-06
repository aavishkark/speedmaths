import { TopicStat } from "../models/TopicStat.js";
import { User } from "../models/User.js";

const getTodayString = () => new Date().toISOString().slice(0, 10);
const getYesterdayString = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
};

// @desc    Get all topic stats for authenticated user
// @route   GET /api/stats
export const getUserStats = async (req, res, next) => {
  try {
    const statsList = await TopicStat.find({ user: req.user._id });
    const statsMap = {};

    statsList.forEach((stat) => {
      statsMap[stat.topicId] = stat;
    });

    res.json({
      success: true,
      stats: statsMap,
      user: req.user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Record a single drill attempt
// @route   POST /api/stats/attempt
export const recordAttempt = async (req, res, next) => {
  try {
    const { topicId, isCorrect, factId } = req.body;
    const userId = req.user._id;
    const today = getTodayString();
    const yesterday = getYesterdayString();

    if (!topicId || typeof isCorrect !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "topicId and isCorrect boolean are required.",
      });
    }

    // Find or create topic stat
    let topicStat = await TopicStat.findOne({ user: userId, topicId });
    if (!topicStat) {
      topicStat = new TopicStat({
        user: userId,
        topicId,
        attempts: 0,
        correct: 0,
        streak: 0,
        bestStreak: 0,
        missedFactIds: [],
        bestSprintScores: {},
      });
    }

    topicStat.attempts += 1;
    if (isCorrect) {
      topicStat.correct += 1;
      topicStat.streak += 1;
      topicStat.bestStreak = Math.max(topicStat.bestStreak, topicStat.streak);
      if (factId && topicStat.missedFactIds.includes(factId)) {
        topicStat.missedFactIds = topicStat.missedFactIds.filter((id) => id !== factId);
      }
    } else {
      topicStat.streak = 0;
      if (factId && !topicStat.missedFactIds.includes(factId)) {
        topicStat.missedFactIds.push(factId);
      }
    }

    await topicStat.save();

    // Update User XP & Streaks
    const user = await User.findById(userId);
    let earnedXp = isCorrect ? 10 : 1;
    if (isCorrect && topicStat.streak > 0 && topicStat.streak % 5 === 0) {
      earnedXp += 15;
    }

    user.xp = (user.xp || 0) + earnedXp;

    // Daily progress & day streak
    if (user.lastActiveDate !== today) {
      if (user.lastActiveDate === yesterday) {
        user.dayStreak = (user.dayStreak || 1) + 1;
      } else {
        user.dayStreak = 1;
      }
      user.dailyProgress = { date: today, count: 1 };
      user.lastActiveDate = today;
    } else {
      const currentCount = (user.dailyProgress?.count || 0) + 1;
      user.dailyProgress = { date: today, count: currentCount };
    }

    await user.save();

    res.json({
      success: true,
      topicStat,
      earnedXp,
      user: user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk sync offline progress to server
// @route   POST /api/stats/sync
export const syncOfflineProgress = async (req, res, next) => {
  try {
    const { stats, xp, dayStreak } = req.body;
    const userId = req.user._id;

    // Update topic stats
    if (stats && typeof stats === "object") {
      for (const [topicId, localStat] of Object.entries(stats)) {
        let topicStat = await TopicStat.findOne({ user: userId, topicId });
        if (!topicStat) {
          topicStat = new TopicStat({ user: userId, topicId });
        }

        topicStat.attempts = Math.max(topicStat.attempts, localStat.attempts || 0);
        topicStat.correct = Math.max(topicStat.correct, localStat.correct || 0);
        topicStat.bestStreak = Math.max(topicStat.bestStreak, localStat.bestStreak || 0);
        
        // Merge missed facts
        const combinedMissed = Array.from(
          new Set([...(topicStat.missedFactIds || []), ...(localStat.missedFactIds || [])]),
        );
        topicStat.missedFactIds = combinedMissed;

        // Merge sprint bests
        if (localStat.bestSprintScores) {
          const currentBests = topicStat.bestSprintScores || new Map();
          Object.entries(localStat.bestSprintScores).forEach(([dur, val]) => {
            const curVal = currentBests.get ? currentBests.get(dur) : currentBests[dur];
            if (!curVal || val > curVal) {
              if (currentBests.set) currentBests.set(dur, val);
              else currentBests[dur] = val;
            }
          });
          topicStat.bestSprintScores = currentBests;
        }

        await topicStat.save();
      }
    }

    // Update User aggregate metrics
    const user = await User.findById(userId);
    if (xp && xp > (user.xp || 0)) {
      user.xp = xp;
    }
    if (dayStreak && dayStreak > (user.dayStreak || 1)) {
      user.dayStreak = dayStreak;
    }
    await user.save();

    const allStats = await TopicStat.find({ user: userId });
    const statsMap = {};
    allStats.forEach((s) => {
      statsMap[s.topicId] = s;
    });

    res.json({
      success: true,
      stats: statsMap,
      user: user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset stats for a specific topic
// @route   DELETE /api/stats/:topicId
export const resetTopic = async (req, res, next) => {
  try {
    const { topicId } = req.params;
    await TopicStat.findOneAndUpdate(
      { user: req.user._id, topicId },
      {
        attempts: 0,
        correct: 0,
        streak: 0,
        bestStreak: 0,
        missedFactIds: [],
        bestSprintScores: {},
      },
      { upsert: true },
    );

    res.json({
      success: true,
      message: `Stats reset for topic ${topicId}`,
    });
  } catch (error) {
    next(error);
  }
};
