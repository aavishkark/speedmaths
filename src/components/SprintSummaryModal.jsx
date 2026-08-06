import { IconLightning, IconTarget, IconTimer, IconTrophy } from "./Icons";

export function SprintSummaryModal({
  duration,
  score,
  isNewBest,
  bestScore,
  onPlayAgain,
  onReviewMisses,
  hasMisses,
  onClose,
}) {
  const accuracy = score.attempts > 0 ? Math.round((score.correct / score.attempts) * 100) : 0;
  const questionsPerMin = Math.round((score.attempts / (duration / 60)) * 10) / 10;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-icon-badge">
            {isNewBest ? <IconTrophy size={36} /> : <IconTimer size={36} />}
          </div>
          <h2>{isNewBest ? "New Personal Best!" : "Sprint Complete!"}</h2>
          <p className="modal-subtitle">{duration}s Challenge</p>
        </div>

        <div className="sprint-stats-summary">
          <div className="summary-stat-box highlight">
            <span className="summary-stat-label">Score</span>
            <strong className="summary-stat-val">
              {score.correct} / {score.attempts}
            </strong>
          </div>

          <div className="summary-stat-box">
            <span className="summary-stat-label">Accuracy</span>
            <strong className="summary-stat-val">{accuracy}%</strong>
          </div>

          <div className="summary-stat-box">
            <span className="summary-stat-label">Pace</span>
            <strong className="summary-stat-val">{questionsPerMin} /min</strong>
          </div>

          <div className="summary-stat-box">
            <span className="summary-stat-label">Best Record</span>
            <strong className="summary-stat-val">{bestScore} correct</strong>
          </div>
        </div>

        <div className="modal-actions">
          <button className="primary-action modal-btn" onClick={onPlayAgain} type="button">
            <IconLightning size={16} />
            <span>Play Again</span>
          </button>
          {hasMisses && (
            <button className="ghost-action modal-btn" onClick={onReviewMisses} type="button">
              <IconTarget size={16} />
              <span>Review Misses</span>
            </button>
          )}
          <button className="text-action modal-btn" onClick={onClose} type="button">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
