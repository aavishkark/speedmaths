import { useState, useMemo } from "react";
import { calculatePrimeFactors } from "../data/speedMath";
import { IconCalculator, IconSparkles } from "./Icons";

const PRESET_NUMBERS = [12, 36, 72, 100, 120, 216, 360, 1000, 1728];

export function FactorSandbox() {
  const [inputVal, setInputVal] = useState("72");

  const factorData = useMemo(() => {
    return calculatePrimeFactors(inputVal);
  }, [inputVal]);

  return (
    <div className="factor-sandbox-card">
      <div className="factor-sandbox-header">
        <div className="sandbox-title-wrap">
          <div className="sandbox-icon-badge">
            <IconCalculator size={18} />
          </div>
          <div>
            <h3>Interactive Factor & Prime Factorization Sandbox</h3>
            <p className="sandbox-subtitle">
              Type any number to see the prime factorization and factor formulas calculated live.
            </p>
          </div>
        </div>

        <div className="sandbox-presets">
          <span className="preset-label">Try CAT Numbers:</span>
          <div className="preset-buttons-row">
            {PRESET_NUMBERS.map((n) => (
              <button
                key={n}
                type="button"
                className={`preset-btn ${inputVal === String(n) ? "active" : ""}`}
                onClick={() => setInputVal(String(n))}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="sandbox-input-row">
        <label htmlFor="factor-input" className="sandbox-input-label">
          Enter Number (2 - 100,000):
        </label>
        <div className="sandbox-input-box">
          <input
            id="factor-input"
            type="number"
            min="2"
            max="100000"
            className="factor-number-input"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="e.g. 72"
          />
          {factorData?.isPerfectSquare && (
            <span className="perfect-square-badge">
              <IconSparkles size={12} /> Perfect Square (Odd Factors)
            </span>
          )}
        </div>
      </div>

      {factorData ? (
        <div className="sandbox-results-grid">
          {/* Prime Factorization Display */}
          <div className="sandbox-hero-result">
            <span className="hero-sub">Prime Factorization Form (N = pᵃ × qᵇ × rᶜ):</span>
            <div className="hero-math-exp">
              <span className="num-hero">{factorData.number}</span>
              <span className="equals-sign">=</span>
              <span className="prime-hero-val">{factorData.primeFormat}</span>
            </div>
          </div>

          {/* 3 Metric Rule Cards */}
          <div className="factor-metrics-row">
            <div className="factor-metric-card">
              <span className="metric-tag">Total Number of Factors</span>
              <div className="metric-formula-title">(a+1)(b+1)...</div>
              <div className="metric-calc-val">{factorData.totalFactorsFormula}</div>
              <span className="metric-meaning">
                {factorData.number} has exactly <strong>{factorData.totalFactorsCount}</strong> factors.
              </span>
            </div>

            <div className="factor-metric-card">
              <span className="metric-tag">Number of Prime Factors</span>
              <div className="metric-formula-title">a + b + c...</div>
              <div className="metric-calc-val">{factorData.primeFactorsFormula}</div>
              <span className="metric-meaning">
                Sum of exponents in prime factorization.
              </span>
            </div>

            <div className="factor-metric-card">
              <span className="metric-tag">Distinct Prime Factors</span>
              <div className="metric-formula-title">Unique bases (p, q, r)</div>
              <div className="metric-calc-val">
                {factorData.distinctPrimes.join(", ")} ({factorData.distinctPrimesCount})
              </div>
              <span className="metric-meaning">
                Distinct prime divisors: {factorData.distinctPrimes.join(" and ")}.
              </span>
            </div>
          </div>

          {/* Factor List & Summary */}
          <div className="factor-list-section">
            <div className="factor-list-header">
              <h4>All {factorData.totalFactorsCount} Factors of {factorData.number}:</h4>
              <span className="sum-tag">
                Sum of Factors = <strong>{factorData.sumOfFactors.toLocaleString()}</strong>
              </span>
            </div>
            <div className="factor-pills-wrap">
              {factorData.allFactors.map((f) => (
                <span key={f} className="factor-pill">
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="sandbox-empty">
          Please enter a valid positive integer between 2 and 100,000.
        </div>
      )}
    </div>
  );
}
