import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import { TOPICS, getFactsForTopic } from "./data/speedMath";
import { Header } from "./components/Header";
import { TopicNav } from "./components/TopicNav";
import { ModeTabs } from "./components/ModeTabs";
import { LearnPanel } from "./components/LearnPanel";
import { QuizPanel } from "./components/QuizPanel";
import { MemoryPanel } from "./components/MemoryPanel";
import { SprintSummaryModal } from "./components/SprintSummaryModal";
import { ProfileModal } from "./components/ProfileModal";
import { AuthModal } from "./components/AuthModal";
import { AchievementToast } from "./components/AchievementToast";
import { Confetti } from "./components/Confetti";
import { useSoundEffects } from "./hooks/useSoundEffects";
import { useUserProfile } from "./hooks/useUserProfile";
import { EMPTY_STATS } from "./hooks/useSpeedMathStats";

const INITIAL_TOPIC_ID = "multiplication";
const DEFAULT_SPRINT_DURATION = 60;
const THEME_STORAGE_KEY = "speedmaths-theme";

const normalizeAnswer = (value) =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/×/g, "x")
    .replace(/[∙·*]/g, "x")
    .replace(/²/g, "^2")
    .replace(/³/g, "^3")
    .replace(/percent/g, "%")
    .replace(/\s+/g, "");

const answerMatches = (input, acceptedAnswers) => {
  const normalizedInput = normalizeAnswer(input);
  return acceptedAnswers.some(
    (acceptedAnswer) => normalizeAnswer(acceptedAnswer) === normalizedInput,
  );
};

const pickDirection = (mode) => {
  if (mode === "reverse") {
    return "reverse";
  }
  if (mode === "sprint") {
    return Math.random() > 0.65 ? "reverse" : "direct";
  }
  return "direct";
};

const pickRandomFact = (facts, previousId) => {
  if (!facts || !facts.length) {
    return null;
  }
  if (facts.length === 1) {
    return facts[0];
  }

  let nextFact = facts[Math.floor(Math.random() * facts.length)];
  let attempts = 0;

  while (nextFact.id === previousId && attempts < 8) {
    nextFact = facts[Math.floor(Math.random() * facts.length)];
    attempts += 1;
  }

  return nextFact;
};

const getCorrectAnswer = (fact, direction) =>
  direction === "reverse" ? fact.reverseAnswer : fact.answer;

export const Home = () => {
  // Theme state
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    try {
      const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (saved) return saved;
      return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } catch {
      return "dark";
    }
  });

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  // Sound effects
  const {
    soundEnabled,
    toggleSound,
    playCorrect,
    playStreak,
    playWrong,
    playTick,
    playFanfare,
  } = useSoundEffects();

  // User Profile & Multi-account state
  const {
    profiles,
    activeUser,
    levelInfo,
    newlyUnlocked,
    isAuthenticated,
    loginCloud,
    registerCloud,
    logout,
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
  } = useUserProfile();

  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // App drill state
  const [selectedTopicId, setSelectedTopicId] = useState(INITIAL_TOPIC_ID);
  const [mode, setMode] = useState("practice");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [currentFact, setCurrentFact] = useState(() =>
    pickRandomFact(getFactsForTopic(INITIAL_TOPIC_ID)),
  );
  const [direction, setDirection] = useState("direct");
  const [reviewIds, setReviewIds] = useState([]);

  // Sprint state
  const [sprintDuration, setSprintDuration] = useState(DEFAULT_SPRINT_DURATION);
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_SPRINT_DURATION);
  const [sprintActive, setSprintActive] = useState(false);
  const [sprintScore, setSprintScore] = useState({ attempts: 0, correct: 0 });
  const [sprintSummary, setSprintSummary] = useState(null);
  const [confettiActive, setConfettiActive] = useState(false);

  const topic = useMemo(
    () => TOPICS.find((item) => item.id === selectedTopicId) ?? TOPICS[0],
    [selectedTopicId],
  );

  const topicFacts = useMemo(
    () => getFactsForTopic(selectedTopicId),
    [selectedTopicId],
  );

  const topicStats = activeUser?.stats?.[selectedTopicId] ?? EMPTY_STATS;
  const missedFactIds = topicStats.missedFactIds ?? EMPTY_STATS.missedFactIds;

  const missedFacts = useMemo(
    () => topicFacts.filter((fact) => missedFactIds.includes(fact.id)),
    [missedFactIds, topicFacts],
  );

  const availableFacts = useMemo(() => {
    if (!reviewIds.length) {
      return topicFacts;
    }
    const reviewFacts = topicFacts.filter((fact) => reviewIds.includes(fact.id));
    return reviewFacts.length ? reviewFacts : topicFacts;
  }, [reviewIds, topicFacts]);

  const rollQuestion = useCallback(
    (sourceFacts = availableFacts) => {
      setCurrentFact((previousFact) =>
        pickRandomFact(sourceFacts, previousFact?.id),
      );
      setDirection(pickDirection(mode));
      setAnswer("");
      setFeedback(null);
    },
    [availableFacts, mode],
  );

  const resetDrillState = useCallback((nextTopicId, nextMode) => {
    const nextFacts = getFactsForTopic(nextTopicId);
    setReviewIds([]);
    setCurrentFact(pickRandomFact(nextFacts));
    setDirection(pickDirection(nextMode));
    setAnswer("");
    setFeedback(null);
    setSprintActive(false);
    setSecondsLeft(DEFAULT_SPRINT_DURATION);
    setSprintScore({ attempts: 0, correct: 0 });
    setSprintSummary(null);
  }, []);

  const handleSelectTopic = useCallback(
    (topicId) => {
      setSelectedTopicId(topicId);
      resetDrillState(topicId, mode);
    },
    [mode, resetDrillState],
  );

  const handleModeChange = useCallback(
    (nextMode) => {
      setMode(nextMode);
      resetDrillState(selectedTopicId, nextMode);
    },
    [resetDrillState, selectedTopicId],
  );

  // Global hotkeys (M for mute, T for theme) when not typing
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === "input" || activeTag === "textarea") return;

      if (e.key === "m" || e.key === "M") {
        toggleSound();
      } else if (e.key === "t" || e.key === "T") {
        toggleTheme();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSound, toggleTheme]);

  const sprintCorrect = sprintScore.correct;
  const sprintAttempts = sprintScore.attempts;

  // Sprint Timer logic & Audio ticks
  useEffect(() => {
    if (mode !== "sprint" || !sprintActive || secondsLeft <= 0) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      if (secondsLeft <= 1) {
        setSecondsLeft(0);
        setSprintActive(false);

        // Sprint finished
        playFanfare();

        const currentBest = topicStats.bestSprintScores?.[sprintDuration] ?? 0;
        const isNewBest = sprintCorrect > currentBest && sprintCorrect > 0;

        recordSprintResult(selectedTopicId, sprintDuration, sprintCorrect);

        if (isNewBest) {
          setConfettiActive(true);
        }

        setSprintSummary({
          isOpen: true,
          score: { attempts: sprintAttempts, correct: sprintCorrect },
          duration: sprintDuration,
          isNewBest,
          bestScore: Math.max(currentBest, sprintCorrect),
        });

        setFeedback({
          status: "done",
          title: "Sprint Complete!",
          detail: `${sprintCorrect}/${sprintAttempts} correct`,
        });
        return;
      }

      if (secondsLeft <= 6 && secondsLeft > 1) {
        playTick();
      }

      setSecondsLeft(secondsLeft - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [
    mode,
    playFanfare,
    playTick,
    recordSprintResult,
    secondsLeft,
    selectedTopicId,
    sprintActive,
    sprintAttempts,
    sprintCorrect,
    sprintDuration,
    topicStats.bestSprintScores,
  ]);

  const handleSubmit = useCallback(() => {
    if (!currentFact || !answer.trim()) {
      return;
    }

    if (mode === "sprint" && !sprintActive) {
      return;
    }

    const acceptedAnswers =
      direction === "reverse"
        ? currentFact.reverseAcceptedAnswers
        : currentFact.acceptedAnswers;
    const isCorrect = answerMatches(answer, acceptedAnswers);
    const correctAnswer = getCorrectAnswer(currentFact, direction);

    recordAttempt(isCorrect, currentFact, selectedTopicId);

    // Audio & Milestone Celebrations
    if (isCorrect) {
      const nextStreak = (topicStats.streak ?? 0) + 1;
      if (nextStreak % 10 === 0 || nextStreak === 5 || nextStreak === 25) {
        playStreak();
        setConfettiActive(true);
      } else {
        playCorrect();
      }
    } else {
      playWrong();
    }

    if (isCorrect && reviewIds.length) {
      setReviewIds((currentIds) =>
        currentIds.filter((factId) => factId !== currentFact.id),
      );
    }

    if (mode === "sprint") {
      setSprintScore((currentScore) => ({
        attempts: currentScore.attempts + 1,
        correct: currentScore.correct + (isCorrect ? 1 : 0),
      }));
    }

    setFeedback({
      status: isCorrect ? "correct" : "wrong",
      title: isCorrect ? "Correct!" : "Incorrect",
      detail: isCorrect ? correctAnswer : `Correct answer: ${correctAnswer}`,
      correct: isCorrect,
    });

    if (mode === "sprint" && secondsLeft > 1) {
      window.setTimeout(() => rollQuestion(), isCorrect ? 300 : 750);
    }
  }, [
    answer,
    currentFact,
    direction,
    mode,
    playCorrect,
    playStreak,
    playWrong,
    recordAttempt,
    reviewIds.length,
    rollQuestion,
    secondsLeft,
    selectedTopicId,
    sprintActive,
    topicStats.streak,
  ]);

  const startSprint = useCallback(() => {
    setReviewIds([]);
    setSprintSummary(null);
    setSprintScore({ attempts: 0, correct: 0 });
    setSecondsLeft(sprintDuration);
    setSprintActive(true);
    setCurrentFact(pickRandomFact(topicFacts));
    setDirection(pickDirection("sprint"));
    setAnswer("");
    setFeedback(null);
  }, [sprintDuration, topicFacts]);

  const stopSprint = useCallback(() => {
    setSprintActive(false);
    setFeedback({
      status: "done",
      title: "Sprint stopped",
      detail: `${sprintScore.correct}/${sprintScore.attempts} correct`,
    });
  }, [sprintScore.attempts, sprintScore.correct]);

  const startReview = useCallback(() => {
    if (!missedFacts.length || mode === "learn") {
      return;
    }
    setReviewIds(missedFacts.map((fact) => fact.id));
    setCurrentFact(pickRandomFact(missedFacts));
    setDirection(pickDirection(mode));
    setAnswer("");
    setFeedback(null);
  }, [missedFacts, mode]);

  const exitReview = useCallback(() => {
    setReviewIds([]);
    setCurrentFact((previousFact) => pickRandomFact(topicFacts, previousFact?.id));
    setDirection(pickDirection(mode));
    setAnswer("");
    setFeedback(null);
  }, [mode, topicFacts]);

  const isReviewing = reviewIds.length > 0;

  return (
    <div
      className="app-shell"
      data-theme={theme}
      style={{ "--accent": topic.accent }}
    >
      <Confetti active={confettiActive} onComplete={() => setConfettiActive(false)} />

      <AchievementToast
        achievement={newlyUnlocked}
        onDismiss={dismissToast}
      />

      <Header
        activeUser={activeUser}
        isAuthenticated={isAuthenticated}
        levelInfo={levelInfo}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenProfile={() => setProfileModalOpen(true)}
        onToggleSound={toggleSound}
        onToggleTheme={toggleTheme}
        soundEnabled={soundEnabled}
        theme={theme}
        topic={topic}
      />

      <TopicNav
        onSelectTopic={handleSelectTopic}
        selectedTopicId={selectedTopicId}
        topics={TOPICS}
      />

      <main className="workspace">
        <section className="trainer-panel">
          <div className="trainer-topline">
            <span className="topic-summary-text">{topic.summary}</span>
            <ModeTabs mode={mode} onModeChange={handleModeChange} />
          </div>

          {mode === "learn" ? (
            <LearnPanel topic={topic} />
          ) : (
            <QuizPanel
              answer={answer}
              direction={direction}
              fact={currentFact}
              feedback={feedback}
              isReviewing={isReviewing}
              mode={mode}
              onAnswerChange={setAnswer}
              onNext={rollQuestion}
              onStartSprint={startSprint}
              onSubmit={handleSubmit}
              sprintActive={sprintActive}
              streak={topicStats.streak ?? 0}
            />
          )}
        </section>

        <MemoryPanel
          isReviewing={isReviewing}
          missedFacts={missedFacts}
          mode={mode}
          onExitReview={exitReview}
          onResetStats={() => resetTopicStats(selectedTopicId)}
          onSelectSprintDuration={setSprintDuration}
          onStartReview={startReview}
          onStartSprint={startSprint}
          onStopSprint={stopSprint}
          secondsLeft={secondsLeft}
          sprintActive={sprintActive}
          sprintDuration={sprintDuration}
          sprintScore={sprintScore}
          stats={topicStats}
        />
      </main>

      {sprintSummary?.isOpen && (
        <SprintSummaryModal
          bestScore={sprintSummary.bestScore}
          duration={sprintSummary.duration}
          hasMisses={missedFacts.length > 0}
          isNewBest={sprintSummary.isNewBest}
          onClose={() => setSprintSummary(null)}
          onPlayAgain={() => {
            setSprintSummary(null);
            startSprint();
          }}
          onReviewMisses={() => {
            setSprintSummary(null);
            handleModeChange("practice");
            startReview();
          }}
          score={sprintSummary.score}
        />
      )}

      {profileModalOpen && (
        <ProfileModal
          activeUser={activeUser}
          createUser={createUser}
          deleteUser={deleteUser}
          exportProfiles={exportProfiles}
          importProfiles={importProfiles}
          isAuthenticated={isAuthenticated}
          levelInfo={levelInfo}
          onClose={() => setProfileModalOpen(false)}
          onLogout={logout}
          onOpenAuth={() => setAuthModalOpen(true)}
          profiles={profiles}
          switchUser={switchUser}
          updateActiveUser={updateActiveUser}
        />
      )}

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onContinueGuest={() => setAuthModalOpen(false)}
        onLogin={loginCloud}
        onRegister={registerCloud}
      />
    </div>
  );
};
