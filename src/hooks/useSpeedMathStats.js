import { useCallback, useEffect, useState } from "react";

export const STORAGE_KEY = "speedmath-progress-v1";

export const EMPTY_STATS = Object.freeze({
  attempts: 0,
  correct: 0,
  streak: 0,
  bestStreak: 0,
  missedFactIds: [],
  bestSprintScores: {}, // { 30: 12, 60: 25, 120: 48 }
});

const loadStats = () => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) ?? {};
  } catch {
    return {};
  }
};

export const useSpeedMathStats = () => {
  const [stats, setStats] = useState(loadStats);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
      } catch {
        // ignore storage errors
      }
    }
  }, [stats]);

  const recordAttempt = useCallback((isCorrect, fact, topicId) => {
    const updateBucket = (bucket = EMPTY_STATS) => {
      const missedSet = new Set(bucket.missedFactIds ?? []);

      if (isCorrect) {
        missedSet.delete(fact.id);
      } else {
        missedSet.add(fact.id);
      }

      const nextStreak = isCorrect ? (bucket.streak ?? 0) + 1 : 0;

      return {
        ...bucket,
        attempts: (bucket.attempts ?? 0) + 1,
        correct: (bucket.correct ?? 0) + (isCorrect ? 1 : 0),
        streak: nextStreak,
        bestStreak: Math.max(bucket.bestStreak ?? 0, nextStreak),
        missedFactIds: [...missedSet].slice(-30),
      };
    };

    setStats((currentStats) => {
      const nextStats = {
        ...currentStats,
        [topicId]: updateBucket(currentStats[topicId]),
      };

      if (topicId === "mixed" && fact.topicId) {
        nextStats[fact.topicId] = updateBucket(currentStats[fact.topicId]);
      }

      return nextStats;
    });
  }, []);

  const recordSprintResult = useCallback((topicId, duration, correctCount) => {
    setStats((currentStats) => {
      const currentTopic = currentStats[topicId] ?? EMPTY_STATS;
      const currentBest = currentTopic.bestSprintScores?.[duration] ?? 0;

      if (correctCount > currentBest) {
        return {
          ...currentStats,
          [topicId]: {
            ...currentTopic,
            bestSprintScores: {
              ...(currentTopic.bestSprintScores ?? {}),
              [duration]: correctCount,
            },
          },
        };
      }
      return currentStats;
    });
  }, []);

  const resetTopicStats = useCallback((topicId) => {
    setStats((currentStats) => {
      const nextStats = { ...currentStats };
      delete nextStats[topicId];
      return nextStats;
    });
  }, []);

  const resetAllStats = useCallback(() => {
    setStats({});
  }, []);

  return {
    stats,
    recordAttempt,
    recordSprintResult,
    resetTopicStats,
    resetAllStats,
  };
};
