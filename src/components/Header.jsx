import { getInitials } from "../hooks/useUserProfile";

export function Header({
  topic,
  theme,
  onToggleTheme,
  soundEnabled,
  onToggleSound,
  activeUser,
  levelInfo,
  onOpenProfile,
}) {
  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="brand-badge">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
        <div className="brand-text">
          <p className="app-tagline">CAT Speed Math</p>
          <h1 className="topic-title">{topic.name}</h1>
        </div>
      </div>

      <div className="header-controls">
        <div className="fact-count-badge">
          <strong>{topic.facts.length}</strong>
          <span>facts</span>
        </div>

        {/* User Profile Trigger Button */}
        {activeUser && (
          <button
            className="user-profile-pill-btn"
            onClick={onOpenProfile}
            type="button"
            aria-label={`Open profile for ${activeUser.name}`}
            title="Open Profile & Analytics"
          >
            <div
              className="user-avatar-monogram header-avatar"
              style={{ "--user-color": activeUser.color }}
            >
              {getInitials(activeUser.name)}
            </div>
            <div className="user-pill-info">
              <span className="user-pill-name">{activeUser.name}</span>
              <span className="user-pill-level">Lvl {levelInfo?.level || 1}</span>
            </div>
          </button>
        )}

        <button
          className="icon-button"
          onClick={onToggleSound}
          type="button"
          aria-label={soundEnabled ? "Mute sound effects" : "Enable sound effects"}
          title={soundEnabled ? "Mute sound (M)" : "Enable sound (M)"}
        >
          {soundEnabled ? (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
            </svg>
          )}
        </button>

        <button
          className="icon-button"
          onClick={onToggleTheme}
          type="button"
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} theme (T)`}
        >
          {theme === "dark" ? (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12.3 2a10 10 0 0 0-1.9 20 10 10 0 0 0 10.9-10.9A10 10 0 0 0 12.3 2z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
