import { useEffect, useRef } from "react";
import { IconCheck, IconCross, IconFlame, IconLightning, IconReverse, IconTarget, IconTimer } from "./Icons";

const getQuestion = (fact, direction) =>
  direction === "reverse" ? fact.reverseQuestion : fact.question;

export function QuizPanel({
  answer,
  direction,
  fact,
  feedback,
  isReviewing,
  mode,
  onAnswerChange,
  onNext,
  onStartSprint,
  onSubmit,
  sprintActive,
  streak = 0,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus input on question change or sprint start
    if (inputRef.current && (mode !== "sprint" || sprintActive)) {
      inputRef.current.focus();
    }
  }, [fact, mode, sprintActive]);

  if (!fact) {
    return (
      <section className="quiz-panel empty">
        <p>Loading drill facts...</p>
        <button
          className="ghost-action"
          onClick={() => onNext()}
          style={{ marginTop: 12 }}
          type="button"
        >
          Load Question ↵
        </button>
      </section>
    );
  }

  const sprintLocked = mode === "sprint" && !sprintActive;

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (feedback?.correct && mode !== "sprint") {
      onNext();
      return;
    }

    onSubmit();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape" && mode !== "sprint") {
      event.preventDefault();
      onNext();
    }
  };

  return (
    <section className="quiz-panel" aria-label="Practice question">
      <div className="quiz-meta-row">
        <div className="quiz-meta-tags">
          <span className="meta-tag group-tag">{fact.group}</span>
          <span className={`meta-tag dir-tag ${direction === "reverse" ? "reverse" : ""}`}>
            {direction === "reverse" ? (
              <>
                <IconReverse size={12} className="tag-icon" />
                <span>Reverse</span>
              </>
            ) : (
              <>
                <IconLightning size={12} className="tag-icon" />
                <span>Direct</span>
              </>
            )}
          </span>
          {isReviewing && (
            <span className="meta-tag review-tag">
              <IconTarget size={12} className="tag-icon" />
              <span>Weak Fact Review</span>
            </span>
          )}
        </div>

        {streak >= 3 && (
          <div className="streak-badge-pill" title={`${streak} in a row!`}>
            <IconFlame size={14} className="flame-icon" />
            <span>{streak} Streak</span>
          </div>
        )}
      </div>

      <div className="question-container">
        <h2 className="question-text">{getQuestion(fact, direction)}</h2>
      </div>

      {sprintLocked ? (
        <div className="sprint-start-card">
          <p className="sprint-intro-text">
            Test your speed and accuracy under time pressure. Answer as many as you can before the clock runs out!
          </p>
          <button className="primary-action pulse-btn" onClick={onStartSprint} type="button">
            <IconLightning size={16} />
            <span>Start Sprint</span>
          </button>
        </div>
      ) : (
        <form className="answer-form" onSubmit={handleFormSubmit}>
          <div className="input-wrapper">
            <input
              ref={inputRef}
              aria-label="Answer"
              autoComplete="off"
              autoFocus
              className={`quiz-input ${feedback ? feedback.status : ""}`}
              onChange={(event) => onAnswerChange(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type answer..."
              value={answer}
            />
          </div>

          <div className="form-actions">
            <button className="primary-action" type="submit">
              {feedback?.correct && mode !== "sprint" ? "Next ↵" : "Check ↵"}
            </button>
            {mode !== "sprint" && (
              <button
                className="ghost-action"
                onClick={() => onNext()}
                type="button"
                title="Skip to next question (Esc)"
              >
                Skip (Esc)
              </button>
            )}
          </div>
        </form>
      )}

      {feedback && (
        <div className={`feedback-alert ${feedback.status}`} aria-live="polite">
          <div className="feedback-icon">
            {feedback.status === "correct" ? (
              <IconCheck size={18} />
            ) : feedback.status === "wrong" ? (
              <IconCross size={18} />
            ) : (
              <IconTimer size={18} />
            )}
          </div>
          <div className="feedback-content">
            <strong>{feedback.title}</strong>
            <span>{feedback.detail}</span>
          </div>
        </div>
      )}
    </section>
  );
}
