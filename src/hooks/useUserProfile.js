import { useCallback, useEffect, useState } from "react";
import { ACHIEVEMENTS, calculateLevelAndProgress } from "../data/achievements";
import { EMPTY_STATS } from "./useSpeedMathStats";

const INITIAL_STATS = {};
const PROFILES_STORAGE_KEY = "speedmath-profiles-v2";
const LEGACY_STORAGE_KEY = "speedmath-progress-v1";

const getTodayString = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};

const getYesterdayString = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const AVATAR_COLORS = [
  { label: "Ocean Blue", value: "#3b82f6" },
  { label: "Emerald", value: "#10b981" },
  { label: "Electric Purple", value: "#8b5cf6" },
  { label: "Amber Sun", value: "#f59e0b" },
  { label: "Crimson", value: "#ef4444" },
  { label: "Cyan Tech", value: "#06b6d4" },
  { label: "Rose", value: "#f43f5e" },
  { label: "Indigo", value: "#6366f1" },
];

export const TARGET_EXAMS = [
  "CAT (IIMs)",
  "GMAT",
  "GRE",
  "Bank PO & SSC",
  "General Speed Math",
];

export const getInitials = (name = "Learner") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "L";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const createDefaultProfile = (legacyStats = null) => ({
  id: "user-default",
  name: "Aspirant",
  color: "#3b82f6",
  targetExam: "CAT (IIMs)",
  dailyGoal: 50,
  dailyProgress: { date: getTodayString(), count: 0 },
  dayStreak: 1,
  lastActiveDate: getTodayString(),
  xp: 0,
  unlockedAchievements: {},
  stats: legacyStats || INITIAL_STATS,
  sprintHistoryCount: 0,
});

const loadInitialProfiles = () => {
  if (typeof window === "undefined") {
    return { profiles: [createDefaultProfile()], activeId: "user-default" };
  }

  try {
    const saved = window.localStorage.getItem(PROFILES_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed?.profiles?.length) {
        return {
          profiles: parsed.profiles,
          activeId: parsed.activeId || parsed.profiles[0].id,
        };
      }
    }

    // Try legacy migration
    let legacyStats = null;
    const oldSaved = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (oldSaved) {
      try {
        legacyStats = JSON.parse(oldSaved);
      } catch {
        // ignore
      }
    }

    const defaultProfile = createDefaultProfile(legacyStats);
    return {
      profiles: [defaultProfile],
      activeId: defaultProfile.id,
    };
  } catch {
    const defaultProfile = createDefaultProfile();
    return { profiles: [defaultProfile], activeId: defaultProfile.id };
  }
};

export function useUserProfile() {
  const [data, setData] = useState(loadInitialProfiles);
  const [newlyUnlocked, setNewlyUnlocked] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore
    }
  }, [data]);

  const activeUser =
    data.profiles.find((p) => p.id === data.activeId) ||
    data.profiles[0] ||
    createDefaultProfile();

  const levelInfo = calculateLevelAndProgress(activeUser.xp || 0);

  const switchUser = useCallback((userId) => {
    setData((prev) => {
      if (!prev.profiles.some((p) => p.id === userId)) return prev;
      return { ...prev, activeId: userId };
    });
  }, []);

  const createUser = useCallback(({ name, color, targetExam, dailyGoal }) => {
    const newProfile = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: name?.trim() || "New Learner",
      color: color || AVATAR_COLORS[0].value,
      targetExam: targetExam || TARGET_EXAMS[0],
      dailyGoal: Number(dailyGoal) || 50,
      dailyProgress: { date: getTodayString(), count: 0 },
      dayStreak: 1,
      lastActiveDate: getTodayString(),
      xp: 0,
      unlockedAchievements: {},
      stats: INITIAL_STATS,
      sprintHistoryCount: 0,
    };

    setData((prev) => ({
      profiles: [...prev.profiles, newProfile],
      activeId: newProfile.id,
    }));

    return newProfile.id;
  }, []);

  const updateActiveUser = useCallback((updater) => {
    setData((prev) => {
      const nextProfiles = prev.profiles.map((profile) => {
        if (profile.id !== prev.activeId) return profile;
        const updated = typeof updater === "function" ? updater(profile) : { ...profile, ...updater };
        return updated;
      });
      return { ...prev, profiles: nextProfiles };
    });
  }, []);

  const deleteUser = useCallback((userId) => {
    setData((prev) => {
      if (prev.profiles.length <= 1) {
        return prev; // Don't delete last profile
      }
      const nextProfiles = prev.profiles.filter((p) => p.id !== userId);
      const nextActiveId =
        prev.activeId === userId ? nextProfiles[0].id : prev.activeId;
      return { profiles: nextProfiles, activeId: nextActiveId };
    });
  }, []);

  // Helper to evaluate and unlock achievements
  const checkAchievements = useCallback((user) => {
    const today = getTodayString();
    const todayCount = user.dailyProgress?.date === today ? user.dailyProgress.count : 0;
    
    // Calculate aggregate metrics across all topics
    let totalAttempts = 0;
    let totalCorrect = 0;
    let bestStreak = 0;
    let maxSprintScore = 0;

    Object.values(user.stats || {}).forEach((topic) => {
      totalAttempts += topic.attempts || 0;
      totalCorrect += topic.correct || 0;
      bestStreak = Math.max(bestStreak, topic.bestStreak || 0);
      Object.values(topic.bestSprintScores || {}).forEach((score) => {
        maxSprintScore = Math.max(maxSprintScore, score || 0);
      });
    });

    const context = {
      totalAttempts,
      totalCorrect,
      bestStreak,
      maxSprintScore,
      sprintCount: user.sprintHistoryCount || 0,
      topicsStats: user.stats,
      todayCount,
      dailyGoal: user.dailyGoal || 50,
      dayStreak: user.dayStreak || 1,
    };

    const newlyUnlockedList = [];
    const unlockedMap = { ...(user.unlockedAchievements || {}) };
    let bonusXp = 0;

    ACHIEVEMENTS.forEach((ach) => {
      if (!unlockedMap[ach.id]) {
        try {
          if (ach.check(context)) {
            unlockedMap[ach.id] = new Date().toISOString();
            bonusXp += ach.xp;
            newlyUnlockedList.push(ach);
          }
        } catch {
          // ignore check error
        }
      }
    });

    return {
      updatedAchievements: unlockedMap,
      newlyUnlockedList,
      bonusXp,
    };
  }, []);

  const recordAttempt = useCallback(
    (isCorrect, fact, topicId) => {
      const today = getTodayString();
      const yesterday = getYesterdayString();

      updateActiveUser((user) => {
        const topicStats = user.stats[topicId] || EMPTY_STATS;
        const nextAttempts = topicStats.attempts + 1;
        const nextCorrect = topicStats.correct + (isCorrect ? 1 : 0);
        const nextStreak = isCorrect ? topicStats.streak + 1 : 0;
        const nextBestStreak = Math.max(topicStats.bestStreak, nextStreak);

        const currentMissed = topicStats.missedFactIds || [];
        let nextMissed = currentMissed;
        if (!isCorrect && !currentMissed.includes(fact.id)) {
          nextMissed = [...currentMissed, fact.id];
        } else if (isCorrect && currentMissed.includes(fact.id)) {
          nextMissed = currentMissed.filter((id) => id !== fact.id);
        }

        const nextTopicStats = {
          ...topicStats,
          attempts: nextAttempts,
          correct: nextCorrect,
          streak: nextStreak,
          bestStreak: nextBestStreak,
          missedFactIds: nextMissed,
        };

        // Daily Streak & Progress calculations
        let nextDayStreak = user.dayStreak || 1;
        let nextDailyProgress = user.dailyProgress || { date: today, count: 0 };

        if (user.lastActiveDate !== today) {
          if (user.lastActiveDate === yesterday) {
            nextDayStreak += 1;
          } else {
            nextDayStreak = 1;
          }
          nextDailyProgress = { date: today, count: 1 };
        } else {
          nextDailyProgress = {
            date: today,
            count: (nextDailyProgress.count || 0) + 1,
          };
        }

        // XP Calculation: 10 XP base for correct, 15 XP bonus for streak milestones
        let earnedXp = isCorrect ? 10 : 1;
        if (isCorrect && nextStreak > 0 && nextStreak % 5 === 0) {
          earnedXp += 15;
        }

        const tempUser = {
          ...user,
          lastActiveDate: today,
          dayStreak: nextDayStreak,
          dailyProgress: nextDailyProgress,
          xp: (user.xp || 0) + earnedXp,
          stats: {
            ...user.stats,
            [topicId]: nextTopicStats,
          },
        };

        const { updatedAchievements, newlyUnlockedList, bonusXp } =
          checkAchievements(tempUser);

        if (newlyUnlockedList.length > 0) {
          setNewlyUnlocked(newlyUnlockedList[0]);
        }

        return {
          ...tempUser,
          xp: tempUser.xp + bonusXp,
          unlockedAchievements: updatedAchievements,
        };
      });
    },
    [checkAchievements, updateActiveUser],
  );

  const recordSprintResult = useCallback(
    (topicId, duration, correctCount) => {
      updateActiveUser((user) => {
        const topicStats = user.stats[topicId] || EMPTY_STATS;
        const currentBestScores = topicStats.bestSprintScores || {};
        const currentBest = currentBestScores[duration] || 0;
        const nextBest = Math.max(currentBest, correctCount);

        const nextTopicStats = {
          ...topicStats,
          bestSprintScores: {
            ...currentBestScores,
            [duration]: nextBest,
          },
        };

        const earnedXp = 50 + correctCount * 5;

        const tempUser = {
          ...user,
          sprintHistoryCount: (user.sprintHistoryCount || 0) + 1,
          xp: (user.xp || 0) + earnedXp,
          stats: {
            ...user.stats,
            [topicId]: nextTopicStats,
          },
        };

        const { updatedAchievements, newlyUnlockedList, bonusXp } =
          checkAchievements(tempUser);

        if (newlyUnlockedList.length > 0) {
          setNewlyUnlocked(newlyUnlockedList[0]);
        }

        return {
          ...tempUser,
          xp: tempUser.xp + bonusXp,
          unlockedAchievements: updatedAchievements,
        };
      });
    },
    [checkAchievements, updateActiveUser],
  );

  const resetTopicStats = useCallback(
    (topicId) => {
      updateActiveUser((user) => ({
        ...user,
        stats: {
          ...user.stats,
          [topicId]: EMPTY_STATS,
        },
      }));
    },
    [updateActiveUser],
  );

  const exportProfiles = useCallback(() => {
    return JSON.stringify(data, null, 2);
  }, [data]);

  const importProfiles = useCallback((jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed?.profiles?.length) {
        setData(parsed);
        return { success: true, message: "Profiles restored successfully!" };
      }
      return { success: false, message: "Invalid profile data format." };
    } catch {
      return { success: false, message: "Failed to parse JSON file." };
    }
  }, []);

  const dismissToast = useCallback(() => {
    setNewlyUnlocked(null);
  }, []);

  return {
    profiles: data.profiles,
    activeUser,
    activeUserId: data.activeId,
    levelInfo,
    newlyUnlocked,
    dismissToast,
    switchUser,
    createUser,
    updateActiveUser,
    deleteUser,
    recordAttempt,
    recordSprintResult,
    resetTopicStats,
    exportProfiles,
    importProfiles,
  };
}
