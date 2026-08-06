export function StatCell({ label, value, highlight, icon }) {
  return (
    <div className={`stat-cell ${highlight ? "highlight" : ""}`}>
      <span className="stat-label">
        {icon && <span className="stat-icon">{icon}</span>}
        {label}
      </span>
      <strong className="stat-value">{value}</strong>
    </div>
  );
}
