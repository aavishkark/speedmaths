import { useMemo, useRef, useState } from "react";
import { ACHIEVEMENTS } from "../data/achievements";
import { TOPICS } from "../data/speedMath";
import {
  AVATAR_COLORS,
  TARGET_EXAMS,
  getInitials,
} from "../hooks/useUserProfile";
import {
  IconAward,
  IconCheck,
  IconFlame,
  IconLightning,
  IconPlus,
  IconTarget,
  IconTimer,
  IconTrophy,
  IconUser,
} from "./Icons";

const getIcon = (iconType, size = 20) => {
  switch (iconType) {
    case "lightning":
      return <IconLightning size={size} />;
    case "flame":
      return <IconFlame size={size} />;
    case "target":
      return <IconTarget size={size} />;
    case "trophy":
      return <IconTrophy size={size} />;
    case "timer":
      return <IconTimer size={size} />;
    case "check":
      return <IconCheck size={size} />;
    default:
      return <IconAward size={size} />;
  }
};

export function ProfileModal({
  activeUser,
  createUser,
  deleteUser,
  exportProfiles,
  importProfiles,
  levelInfo,
  onClose,
  profiles,
  switchUser,
  updateActiveUser,
  isAuthenticated,
  onLogout,
  onOpenAuth,
}) {
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'achievements' | 'accounts'
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);

  // New user form state
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(AVATAR_COLORS[0].value);
  const [newExam, setNewExam] = useState(TARGET_EXAMS[0]);
  const [newGoal, setNewGoal] = useState(50);

  // Edit active user form state
  const [editName, setEditName] = useState(activeUser.name);
  const [editColor, setEditColor] = useState(activeUser.color);
  const [editExam, setEditExam] = useState(activeUser.targetExam);
  const [editGoal, setEditGoal] = useState(activeUser.dailyGoal || 50);

  const fileInputRef = useRef(null);
  const [importStatus, setImportStatus] = useState(null);

  // Aggregated metrics
  const aggregatedStats = useMemo(() => {
    let totalAttempts = 0;
    let totalCorrect = 0;
    let bestStreak = 0;

    TOPICS.forEach((topic) => {
      const stat = activeUser.stats?.[topic.id];
      if (stat) {
        totalAttempts += stat.attempts || 0;
        totalCorrect += stat.correct || 0;
        bestStreak = Math.max(bestStreak, stat.bestStreak || 0);
      }
    });

    const accuracy =
      totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

    return {
      totalAttempts,
      totalCorrect,
      bestStreak,
      accuracy,
    };
  }, [activeUser.stats]);

  const todayCount =
    activeUser.dailyProgress?.date === new Date().toISOString().slice(0, 10)
      ? activeUser.dailyProgress.count
      : 0;

  const unlockedCount = Object.keys(
    activeUser.unlockedAchievements || {},
  ).length;

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    createUser({
      name: newName,
      color: newColor,
      targetExam: newExam,
      dailyGoal: newGoal,
    });
    setNewName("");
    setIsCreatingUser(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editName.trim()) return;
    updateActiveUser({
      name: editName.trim(),
      color: editColor,
      targetExam: editExam,
      dailyGoal: Number(editGoal) || 50,
    });
    setIsEditingUser(false);
  };

  const handleExport = () => {
    const dataStr = exportProfiles();
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `speedmaths-profiles-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === "string") {
        const result = importProfiles(content);
        setImportStatus(result);
        window.setTimeout(() => setImportStatus(null), 4000);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="profile-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Profile Card Header */}
        <div className="profile-header-banner">
          <div className="profile-badge-row">
            <div
              className="user-avatar-monogram large"
              style={{ "--user-color": activeUser.color }}
            >
              {getInitials(activeUser.name)}
            </div>

            <div className="profile-identity">
              <div className="profile-name-row">
                <h3>{activeUser.name}</h3>
                <span className="exam-target-chip">{activeUser.targetExam}</span>
                {isAuthenticated ? (
                  <span className="cloud-status-chip online" title="Synchronized with cloud database">
                    Cloud Synced
                  </span>
                ) : (
                  <span className="cloud-status-chip offline" title="Drills saved locally on this browser">
                    Guest Mode
                  </span>
                )}
              </div>
              <p className="profile-rank-subtitle">
                Level {levelInfo.level} • {levelInfo.rank}
              </p>
            </div>

            <div className="profile-header-actions">
              {isAuthenticated ? (
                <button
                  className="auth-header-btn logout"
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  type="button"
                >
                  Log Out
                </button>
              ) : (
                <button
                  className="auth-header-btn login"
                  onClick={() => {
                    onClose();
                    onOpenAuth();
                  }}
                  type="button"
                >
                  Sign In
                </button>
              )}

              <button
                className="close-modal-icon-btn"
                onClick={onClose}
                type="button"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="xp-progress-section">
            <div className="xp-label-row">
              <span>XP: {activeUser.xp || 0}</span>
              <span>
                {levelInfo.currentLevelProgressXp} / {levelInfo.levelXpSpan} to Lvl{" "}
                {levelInfo.level + 1}
              </span>
            </div>
            <div className="xp-track">
              <div
                className="xp-bar"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="profile-tab-bar" role="tablist">
          <button
            className={`profile-tab ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
            type="button"
          >
            <IconUser size={14} />
            <span>Overview & Mastery</span>
          </button>
          <button
            className={`profile-tab ${activeTab === "achievements" ? "active" : ""}`}
            onClick={() => setActiveTab("achievements")}
            type="button"
          >
            <IconTrophy size={14} />
            <span>
              Badges ({unlockedCount}/{ACHIEVEMENTS.length})
            </span>
          </button>
          <button
            className={`profile-tab ${activeTab === "accounts" ? "active" : ""}`}
            onClick={() => setActiveTab("accounts")}
            type="button"
          >
            <IconAward size={14} />
            <span>Accounts & Settings</span>
          </button>
        </div>

        {/* Tab 1: Overview & Mastery */}
        {activeTab === "overview" && (
          <div className="profile-tab-content">
            <div className="profile-kpi-grid">
              <div className="profile-kpi-card">
                <span className="kpi-label">Accuracy</span>
                <strong className="kpi-value">{aggregatedStats.accuracy}%</strong>
              </div>
              <div className="profile-kpi-card">
                <span className="kpi-label">Questions Solved</span>
                <strong className="kpi-value">{aggregatedStats.totalAttempts}</strong>
              </div>
              <div className="profile-kpi-card">
                <span className="kpi-label">Best Streak</span>
                <strong className="kpi-value">{aggregatedStats.bestStreak}</strong>
              </div>
              <div className="profile-kpi-card">
                <span className="kpi-label">Day Streak</span>
                <strong className="kpi-value">{activeUser.dayStreak || 1}d</strong>
              </div>
            </div>

            {/* Daily Goal Tracker */}
            <div className="daily-goal-box">
              <div className="goal-header">
                <div>
                  <strong>Daily Practice Target</strong>
                  <span className="goal-sub">
                    {todayCount} / {activeUser.dailyGoal || 50} questions completed today
                  </span>
                </div>
                <span className="goal-percent">
                  {Math.min(
                    100,
                    Math.round(
                      (todayCount / (activeUser.dailyGoal || 50)) * 100,
                    ),
                  )}
                  %
                </span>
              </div>
              <div className="goal-track">
                <div
                  className="goal-bar"
                  style={{
                    width: `${Math.min(
                      100,
                      (todayCount / (activeUser.dailyGoal || 50)) * 100,
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Topic by Topic Mastery Breakdown */}
            <div className="topic-mastery-list">
              <h4 className="section-heading">Topic Mastery</h4>
              <div className="topic-mastery-grid">
                {TOPICS.map((t) => {
                  const stat = activeUser.stats?.[t.id];
                  const attempts = stat?.attempts || 0;
                  const correct = stat?.correct || 0;
                  const acc =
                    attempts > 0 ? Math.round((correct / attempts) * 100) : 0;
                  return (
                    <div className="topic-mastery-card" key={t.id}>
                      <div className="tm-header">
                        <span className="tm-name">{t.name}</span>
                        <span className="tm-acc">{acc}%</span>
                      </div>
                      <div className="tm-bar-bg">
                        <div
                          className="tm-bar"
                          style={{
                            width: `${acc}%`,
                            backgroundColor: t.accent,
                          }}
                        />
                      </div>
                      <div className="tm-meta">
                        <span>{attempts} attempts</span>
                        <span>Best streak: {stat?.bestStreak || 0}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Achievements */}
        {activeTab === "achievements" && (
          <div className="profile-tab-content">
            <div className="achievements-gallery-grid">
              {ACHIEVEMENTS.map((ach) => {
                const isUnlocked = Boolean(
                  activeUser.unlockedAchievements?.[ach.id],
                );
                const unlockDate = activeUser.unlockedAchievements?.[ach.id];
                return (
                  <div
                    className={`achievement-badge-card ${isUnlocked ? "unlocked" : "locked"}`}
                    key={ach.id}
                  >
                    <div className="badge-icon-wrap">
                      {getIcon(ach.iconType, 22)}
                    </div>
                    <div className="badge-info">
                      <div className="badge-title-row">
                        <h5>{ach.title}</h5>
                        <span className="badge-xp-chip">+{ach.xp} XP</span>
                      </div>
                      <p className="badge-desc">{ach.description}</p>
                      <span className="badge-status-text">
                        {isUnlocked
                          ? `Unlocked ${new Date(unlockDate).toLocaleDateString()}`
                          : "Locked"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Accounts & Settings */}
        {activeTab === "accounts" && (
          <div className="profile-tab-content">
            {/* Edit Current Profile */}
            <div className="settings-section">
              <div className="section-title-row">
                <h4 className="section-heading">Current Profile Settings</h4>
                <button
                  className="ghost-action-btn small"
                  onClick={() => setIsEditingUser((prev) => !prev)}
                  type="button"
                >
                  {isEditingUser ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              {isEditingUser ? (
                <form className="profile-form" onSubmit={handleEditSubmit}>
                  <div className="form-group">
                    <label>Display Name</label>
                    <input
                      className="form-input"
                      maxLength={24}
                      onChange={(e) => setEditName(e.target.value)}
                      required
                      value={editName}
                    />
                  </div>

                  <div className="form-group">
                    <label>Monogram Accent Color</label>
                    <div className="color-picker-row">
                      {AVATAR_COLORS.map((c) => (
                        <button
                          key={c.value}
                          type="button"
                          className={`color-circle ${editColor === c.value ? "selected" : ""}`}
                          style={{ backgroundColor: c.value }}
                          onClick={() => setEditColor(c.value)}
                          title={c.label}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Target Exam</label>
                      <select
                        className="form-select"
                        value={editExam}
                        onChange={(e) => setEditExam(e.target.value)}
                      >
                        {TARGET_EXAMS.map((exam) => (
                          <option key={exam} value={exam}>
                            {exam}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Daily Goal (Questions)</label>
                      <input
                        className="form-input"
                        type="number"
                        min={10}
                        max={500}
                        value={editGoal}
                        onChange={(e) => setEditGoal(e.target.value)}
                      />
                    </div>
                  </div>

                  <button className="primary-action modal-btn" type="submit">
                    Save Changes
                  </button>
                </form>
              ) : (
                <div className="profile-info-preview">
                  <div className="info-item">
                    <span className="info-key">Name:</span>
                    <strong>{activeUser.name}</strong>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Target Exam:</span>
                    <strong>{activeUser.targetExam}</strong>
                  </div>
                  <div className="info-item">
                    <span className="info-key">Daily Target:</span>
                    <strong>{activeUser.dailyGoal || 50} questions</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Switch Profiles List */}
            <div className="settings-section">
              <div className="section-title-row">
                <h4 className="section-heading">All Learner Profiles</h4>
                <button
                  className="ghost-action-btn small"
                  onClick={() => setIsCreatingUser((prev) => !prev)}
                  type="button"
                >
                  <IconPlus size={12} />
                  <span>{isCreatingUser ? "Cancel" : "Add Profile"}</span>
                </button>
              </div>

              {isCreatingUser && (
                <form className="profile-form new-user" onSubmit={handleCreateSubmit}>
                  <h5>Create New Learner Profile</h5>
                  <div className="form-group">
                    <label>Learner Name</label>
                    <input
                      className="form-input"
                      placeholder="e.g. Alex, Aspirant 2"
                      maxLength={24}
                      onChange={(e) => setNewName(e.target.value)}
                      required
                      value={newName}
                    />
                  </div>

                  <div className="form-group">
                    <label>Monogram Accent Color</label>
                    <div className="color-picker-row">
                      {AVATAR_COLORS.map((c) => (
                        <button
                          key={c.value}
                          type="button"
                          className={`color-circle ${newColor === c.value ? "selected" : ""}`}
                          style={{ backgroundColor: c.value }}
                          onClick={() => setNewColor(c.value)}
                          title={c.label}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Target Exam</label>
                      <select
                        className="form-select"
                        value={newExam}
                        onChange={(e) => setNewExam(e.target.value)}
                      >
                        {TARGET_EXAMS.map((exam) => (
                          <option key={exam} value={exam}>
                            {exam}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Daily Goal</label>
                      <input
                        className="form-input"
                        type="number"
                        min={10}
                        max={500}
                        value={newGoal}
                        onChange={(e) => setNewGoal(e.target.value)}
                      />
                    </div>
                  </div>

                  <button className="primary-action modal-btn" type="submit">
                    Create Profile
                  </button>
                </form>
              )}

              <div className="profiles-list">
                {profiles.map((p) => {
                  const isActive = p.id === activeUser.id;
                  return (
                    <div
                      className={`profile-card-item ${isActive ? "active" : ""}`}
                      key={p.id}
                    >
                      <div
                        className="user-avatar-monogram small"
                        style={{ "--user-color": p.color }}
                      >
                        {getInitials(p.name)}
                      </div>

                      <div className="profile-item-meta">
                        <div className="profile-item-name">{p.name}</div>
                        <div className="profile-item-sub">
                          {p.targetExam} • {p.xp || 0} XP
                        </div>
                      </div>

                      <div className="profile-item-actions">
                        {isActive ? (
                          <span className="active-pill">Active</span>
                        ) : (
                          <button
                            className="switch-btn"
                            onClick={() => switchUser(p.id)}
                            type="button"
                          >
                            Switch
                          </button>
                        )}
                        {profiles.length > 1 && (
                          <button
                            className="delete-user-btn"
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Delete profile "${p.name}"? This action cannot be undone.`,
                                )
                              ) {
                                deleteUser(p.id);
                              }
                            }}
                            type="button"
                            title="Delete profile"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Data Export & Backup */}
            <div className="settings-section backup">
              <h4 className="section-heading">Data Management & Backup</h4>
              <p className="backup-desc">
                Export all user profiles, statistics, and unlocked achievements as a
                JSON file, or restore from a previous backup.
              </p>
              <div className="backup-actions">
                <button className="ghost-action-btn" onClick={handleExport} type="button">
                  Export Backup (JSON)
                </button>
                <button
                  className="ghost-action-btn"
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                >
                  Import Backup
                </button>
                <input
                  ref={fileInputRef}
                  accept=".json"
                  onChange={handleImportFile}
                  style={{ display: "none" }}
                  type="file"
                />
              </div>
              {importStatus && (
                <div
                  className={`import-alert ${importStatus.success ? "success" : "error"}`}
                >
                  {importStatus.message}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
