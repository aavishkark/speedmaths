import { useState } from "react";
import { AVATAR_COLORS, TARGET_EXAMS } from "../hooks/useUserProfile";
import { IconAward, IconCheck, IconLightning, IconUser } from "./Icons";

export function AuthModal({ isOpen, onClose, onLogin, onRegister, onContinueGuest }) {
  const [tab, setTab] = useState("login"); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Login form
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form
  const [regName, setRegName] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regColor, setRegColor] = useState(AVATAR_COLORS[0].value);
  const [regExam, setRegExam] = useState(TARGET_EXAMS[0]);
  const [regGoal, setRegGoal] = useState(50);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!loginUsername.trim() || !loginPassword.trim()) {
      setError("Please fill in both username and password/PIN.");
      return;
    }

    setLoading(true);
    try {
      await onLogin({
        username: loginUsername.trim(),
        password: loginPassword.trim(),
      });
      onClose();
    } catch (err) {
      setError(err.message || "Failed to log in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!regName.trim() || !regUsername.trim() || !regPassword.trim()) {
      setError("Please complete all required fields.");
      return;
    }

    if (regPassword.length < 4) {
      setError("Password or PIN must be at least 4 characters.");
      return;
    }

    setLoading(true);
    try {
      await onRegister({
        name: regName.trim(),
        username: regUsername.trim(),
        password: regPassword.trim(),
        color: regColor,
        targetExam: regExam,
        dailyGoal: Number(regGoal) || 50,
      });
      onClose();
    } catch (err) {
      setError(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-header">
          <div className="auth-brand-badge">
            <IconLightning size={24} />
          </div>
          <h3>SpeedMaths Account</h3>
          <p className="auth-subtitle">
            Sign in to synchronize your math drills, XP, streaks, and achievements
            across devices.
          </p>
          <button
            className="close-modal-icon-btn auth-close"
            onClick={onClose}
            type="button"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="auth-tab-switch">
          <button
            className={`auth-tab-btn ${tab === "login" ? "active" : ""}`}
            onClick={() => {
              setTab("login");
              setError(null);
            }}
            type="button"
          >
            <IconUser size={15} />
            <span>Sign In</span>
          </button>
          <button
            className={`auth-tab-btn ${tab === "register" ? "active" : ""}`}
            onClick={() => {
              setTab("register");
              setError(null);
            }}
            type="button"
          >
            <IconAward size={15} />
            <span>Create Account</span>
          </button>
        </div>

        {error && <div className="auth-error-banner">{error}</div>}

        {tab === "login" ? (
          <form className="auth-form" onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input
                className="form-input"
                placeholder="e.g. aspirant_01"
                required
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label>Password or PIN</label>
              <input
                className="form-input"
                type="password"
                placeholder="Enter 4-digit PIN or password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>

            <button
              className="primary-action modal-btn auth-submit-btn"
              disabled={loading}
              type="submit"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <div className="auth-footer-options">
              <button
                className="guest-action-link"
                onClick={() => {
                  onContinueGuest();
                  onClose();
                }}
                type="button"
              >
                Continue as Guest (Offline)
              </button>
            </div>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleRegisterSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Your Name</label>
                <input
                  className="form-input"
                  placeholder="e.g. Alex Sharma"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Username</label>
                <input
                  className="form-input"
                  placeholder="e.g. topper99"
                  required
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password or Security PIN</label>
              <input
                className="form-input"
                type="password"
                placeholder="Minimum 4 characters or digits"
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Monogram Theme Color</label>
              <div className="color-picker-row">
                {AVATAR_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    className={`color-circle ${regColor === c.value ? "selected" : ""}`}
                    style={{ backgroundColor: c.value }}
                    onClick={() => setRegColor(c.value)}
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
                  value={regExam}
                  onChange={(e) => setRegExam(e.target.value)}
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
                  value={regGoal}
                  onChange={(e) => setRegGoal(e.target.value)}
                />
              </div>
            </div>

            <button
              className="primary-action modal-btn auth-submit-btn"
              disabled={loading}
              type="submit"
            >
              <IconCheck size={16} />
              <span>{loading ? "Creating..." : "Create Account & Start Learning"}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
