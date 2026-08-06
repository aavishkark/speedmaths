export const ACHIEVEMENTS = [
  {
    id: "first_step",
    title: "First Step",
    description: "Answer your first 10 questions.",
    xp: 50,
    iconType: "lightning",
    check: ({ totalAttempts }) => totalAttempts >= 10,
  },
  {
    id: "streak_10",
    title: "Streak Spark",
    description: "Reach a 10-question streak in any drill.",
    xp: 75,
    iconType: "flame",
    check: ({ bestStreak }) => bestStreak >= 10,
  },
  {
    id: "streak_25",
    title: "Streak Master",
    description: "Reach a 25-question streak in any drill.",
    xp: 150,
    iconType: "flame",
    check: ({ bestStreak }) => bestStreak >= 25,
  },
  {
    id: "centurion",
    title: "Centurion",
    description: "Answer 100 total questions.",
    xp: 200,
    iconType: "target",
    check: ({ totalAttempts }) => totalAttempts >= 100,
  },
  {
    id: "half_k",
    title: "Math Gladiator",
    description: "Answer 500 total questions.",
    xp: 400,
    iconType: "award",
    check: ({ totalAttempts }) => totalAttempts >= 500,
  },
  {
    id: "grandmaster",
    title: "Calculation Grandmaster",
    description: "Answer 1,000 total questions.",
    xp: 800,
    iconType: "trophy",
    check: ({ totalAttempts }) => totalAttempts >= 1000,
  },
  {
    id: "speed_demon",
    title: "Speed Demon",
    description: "Score 20+ correct in any sprint session.",
    xp: 150,
    iconType: "timer",
    check: ({ maxSprintScore }) => maxSprintScore >= 20,
  },
  {
    id: "sprint_veteran",
    title: "Sprint Veteran",
    description: "Complete 10 sprint sessions.",
    xp: 200,
    iconType: "timer",
    check: ({ sprintCount }) => sprintCount >= 10,
  },
  {
    id: "sharpshooter",
    title: "Sharpshooter",
    description: "Achieve 95%+ accuracy with at least 50 attempts in a topic.",
    xp: 250,
    iconType: "check",
    check: ({ topicsStats }) =>
      Object.values(topicsStats || {}).some(
        (t) => t.attempts >= 50 && t.correct / t.attempts >= 0.95,
      ),
  },
  {
    id: "daily_dedication",
    title: "Daily Goal Crusher",
    description: "Complete your daily question target.",
    xp: 100,
    iconType: "award",
    check: ({ todayCount, dailyGoal }) => todayCount >= dailyGoal,
  },
  {
    id: "week_warrior",
    title: "7-Day Streak",
    description: "Practice for 7 consecutive days.",
    xp: 300,
    iconType: "trophy",
    check: ({ dayStreak }) => dayStreak >= 7,
  },
];

export const getRankFromLevel = (level) => {
  if (level >= 30) return "Calculation Grandmaster";
  if (level >= 20) return "Speed Wizard";
  if (level >= 15) return "Mental Prodigy";
  if (level >= 10) return "Math Ninja";
  if (level >= 5) return "Scholar";
  if (level >= 2) return "Apprentice";
  return "Novice";
};

export const calculateLevelAndProgress = (totalXp = 0) => {
  // Level formula: Level = Math.floor(Math.sqrt(totalXp / 50)) + 1
  // XP for level L = (L-1)^2 * 50
  let level = 1;
  while ((level * level) * 50 <= totalXp) {
    level += 1;
  }
  const currentLevelBaseXp = ((level - 1) * (level - 1)) * 50;
  const nextLevelBaseXp = (level * level) * 50;
  const levelXpSpan = nextLevelBaseXp - currentLevelBaseXp;
  const currentLevelProgressXp = totalXp - currentLevelBaseXp;
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round((currentLevelProgressXp / levelXpSpan) * 100)),
  );

  return {
    level,
    rank: getRankFromLevel(level),
    currentLevelProgressXp,
    levelXpSpan,
    progressPercent,
    nextLevelBaseXp,
  };
};
