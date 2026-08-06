import { IconBook, IconLightning, IconReverse, IconTimer } from "./Icons";

const DRILL_MODES = [
  { id: "learn", label: "Learn", Icon: IconBook },
  { id: "practice", label: "Practice", Icon: IconLightning },
  { id: "reverse", label: "Reverse", Icon: IconReverse },
  { id: "sprint", label: "Sprint", Icon: IconTimer },
];

export function ModeTabs({ mode, onModeChange }) {
  return (
    <div className="mode-tabs" role="tablist" aria-label="Drill mode">
      {DRILL_MODES.map((drillMode) => {
        const isActive = mode === drillMode.id;
        const Icon = drillMode.Icon;
        return (
          <button
            aria-selected={isActive}
            className={`mode-tab ${isActive ? "active" : ""}`}
            key={drillMode.id}
            onClick={() => onModeChange(drillMode.id)}
            role="tab"
            type="button"
          >
            <span className="mode-icon">
              <Icon size={14} />
            </span>
            <span className="mode-label">{drillMode.label}</span>
          </button>
        );
      })}
    </div>
  );
}
