import { useEffect } from "react";
import { IconAward, IconCheck, IconFlame, IconLightning, IconTarget, IconTimer, IconTrophy } from "./Icons";

const getIcon = (iconType) => {
  switch (iconType) {
    case "lightning":
      return <IconLightning size={24} />;
    case "flame":
      return <IconFlame size={24} />;
    case "target":
      return <IconTarget size={24} />;
    case "trophy":
      return <IconTrophy size={24} />;
    case "timer":
      return <IconTimer size={24} />;
    case "check":
      return <IconCheck size={24} />;
    default:
      return <IconAward size={24} />;
  }
};

export function AchievementToast({ achievement, onDismiss }) {
  useEffect(() => {
    if (!achievement) return undefined;
    const timer = window.setTimeout(() => {
      onDismiss();
    }, 4500);
    return () => window.clearTimeout(timer);
  }, [achievement, onDismiss]);

  if (!achievement) return null;

  return (
    <div className="achievement-toast-container" role="status" aria-live="polite">
      <div className="achievement-toast-card">
        <div className="toast-icon-wrapper">
          {getIcon(achievement.iconType)}
        </div>
        <div className="toast-content">
          <div className="toast-eyebrow">Achievement Unlocked!</div>
          <h4 className="toast-title">{achievement.title}</h4>
          <p className="toast-desc">{achievement.description}</p>
        </div>
        <div className="toast-xp-pill">+{achievement.xp} XP</div>
        <button className="toast-close-btn" onClick={onDismiss} type="button" aria-label="Close notification">
          ×
        </button>
      </div>
    </div>
  );
}
