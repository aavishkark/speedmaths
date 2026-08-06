const DRILL_MODES = [
  { id: "learn", label: "Learn", icon: "📖" },
  { id: "practice", label: "Practice", icon: "⚡" },
  { id: "reverse", label: "Reverse", icon: "🔄" },
  { id: "sprint", label: "Sprint", icon: "⏱️" },
];

export function ModeTabs({ mode, onModeChange }) {
  return (
    <div className="mode-tabs" role="tablist" aria-label="Drill mode">
      {DRILL_MODES.map((drillMode) => {
        const isActive = mode === drillMode.id;
        return (
          <button
            aria-selected={isActive}
            className={`mode-tab ${isActive ? "active" : ""}`}
            key={drillMode.id}
            onClick={() => onModeChange(drillMode.id)}
            role="tab"
            type="button"
          >
            <span className="mode-icon">{drillMode.icon}</span>
            <span className="mode-label">{drillMode.label}</span>
          </button>
        );
      })}
    </div>
  );
}
