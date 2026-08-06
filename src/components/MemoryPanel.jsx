import { StatCell } from "./StatCell";
import { IconCheck, IconFlame, IconTarget, IconTimer } from "./Icons";

const SPRINT_DURATIONS = [30, 60, 120];

const getAccuracy = (stats) => {
  if (!stats?.attempts) {
    return "0%";
  }
  return `${Math.round((stats.correct / stats.attempts) * 100)}%`;
};

export function MemoryPanel({
  isReviewing,
  missedFacts,
  mode,
  onExitReview,
  onResetStats,
  onStartReview,
  onStartSprint,
  onStopSprint,
  secondsLeft,
  sprintActive,
  sprintDuration,
  onSelectSprintDuration,
  sprintScore,
  stats,
}) {
  const progressPercent = sprintActive
    ? ((sprintDuration - secondsLeft) / sprintDuration) * 100
    : 0;

  const bestSprintScore = stats?.bestSprintScores?.[sprintDuration] ?? 0;

  return (
    <aside className="memory-panel" aria-label="Progress and Memory HUD">
      <div className="panel-header">
        <h3>Performance HUD</h3>
      </div>

      <div className="stats-grid">
        <StatCell label="Accuracy" value={getAccuracy(stats)} />
        <StatCell label="Attempts" value={stats?.attempts ?? 0} />
        <StatCell
          label="Streak"
          value={stats?.streak ?? 0}
          icon={stats?.streak >= 3 ? <IconFlame size={14} /> : undefined}
          highlight={stats?.streak >= 5}
        />
        <StatCell label="Best Streak" value={stats?.bestStreak ?? 0} />
      </div>

      {mode === "sprint" && (
        <div className="sprint-box">
          <div className="sprint-box-header">
            <div className="sprint-label-row">
              <IconTimer size={16} />
              <span className="sprint-label">Timed Sprint</span>
            </div>
            {!sprintActive && (
              <div className="duration-selector">
                {SPRINT_DURATIONS.map((dur) => (
                  <button
                    key={dur}
                    className={`dur-pill ${sprintDuration === dur ? "active" : ""}`}
                    onClick={() => onSelectSprintDuration(dur)}
                    type="button"
                  >
                    {dur}s
                  </button>
                ))}
              </div>
            )}
          </div>

          {sprintActive && (
            <div className="sprint-progress-bar-container">
              <div
                className="sprint-progress-bar"
                style={{ width: `${100 - progressPercent}%` }}
              />
            </div>
          )}

          <div className="sprint-metrics">
            <div className="metric-col">
              <span className="metric-title">Time Left</span>
              <strong className={`metric-value ${secondsLeft <= 5 && sprintActive ? "pulse-urgent" : ""}`}>
                {secondsLeft}s
              </strong>
            </div>

            <div className="metric-col">
              <span className="metric-title">Live Score</span>
              <strong className="metric-value">
                {sprintScore.correct}/{sprintScore.attempts}
              </strong>
            </div>

            <div className="metric-col">
              <span className="metric-title">Best ({sprintDuration}s)</span>
              <strong className="metric-value best-val">
                {bestSprintScore}
              </strong>
            </div>
          </div>

          <div className="sprint-actions">
            <button className="primary-action-btn" onClick={onStartSprint} type="button">
              {sprintActive ? "Restart" : `Start ${sprintDuration}s Sprint`}
            </button>
            <button
              className="ghost-action-btn"
              disabled={!sprintActive}
              onClick={onStopSprint}
              type="button"
            >
              Stop
            </button>
          </div>
        </div>
      )}

      <div className="review-box">
        <div className="review-heading">
          <div className="review-title">
            <IconTarget size={16} />
            <span>Weak Facts</span>
          </div>
          <span className="miss-count-badge">{missedFacts.length}</span>
        </div>

        <div className="miss-list">
          {missedFacts.length ? (
            missedFacts.slice(0, 6).map((fact) => (
              <span className="miss-chip" key={fact.id}>
                {fact.learnLabel}
              </span>
            ))
          ) : (
            <div className="clean-slate">
              <IconCheck size={14} />
              <span>All clear! No weak facts.</span>
            </div>
          )}
        </div>

        <div className="review-actions">
          {isReviewing ? (
            <button className="review-btn exit" onClick={onExitReview} type="button">
              Exit Review
            </button>
          ) : (
            <button
              className="review-btn start"
              disabled={!missedFacts.length || mode === "learn"}
              onClick={onStartReview}
              type="button"
            >
              Review Misses ({missedFacts.length})
            </button>
          )}
          <button
            className="reset-btn"
            disabled={!stats?.attempts}
            onClick={() => {
              if (window.confirm("Reset statistics for this topic?")) {
                onResetStats();
              }
            }}
            type="button"
            title="Reset statistics for this topic"
          >
            Reset Stats
          </button>
        </div>
      </div>
    </aside>
  );
}
