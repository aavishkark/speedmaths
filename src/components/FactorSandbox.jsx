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
      <div className="factor-sandbox-top">
        <div className="sandbox-title-wrap">
          <IconCalculator size={16} />
          <h3>Factor & Prime Sandbox</h3>
        </div>

        <div className="sandbox-presets">
          <span className="preset-label">CAT Presets:</span>
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
        <div className="sandbox-input-box">
          <label htmlFor="factor-input" className="sandbox-input-label">
            Calculate N =
          </label>
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
        </div>
        {factorData?.isPerfectSquare && (
          <span className="perfect-square-badge">
            <IconSparkles size={12} /> Perfect Square (Odd Factors)
          </span>
        )}
      </div>

      {factorData ? (
        <div className="sandbox-results-grid">
          {/* Prime Factorization Display */}
          <div className="sandbox-hero-result">
            <span className="hero-sub">Prime Factorization Form (N = pᵃ × qᵇ × rᶜ)</span>
            <div className="hero-math-exp">
              <span className="num-hero">{factorData.number}</span>
              <span className="equals-sign">=</span>
              <span className="prime-hero-val">{factorData.primeFormat}</span>
            </div>
          </div>

          {/* 3 Metric Rule Cards */}
          <div className="factor-metrics-row">
            <div className="factor-metric-card">
              <span className="metric-tag">Total Factors</span>
              <div className="metric-calc-val">{factorData.totalFactorsFormula}</div>
              <span className="metric-meaning">
                <strong>{factorData.totalFactorsCount}</strong> total factors
              </span>
            </div>

            <div className="factor-metric-card">
              <span className="metric-tag">Prime Factors</span>
              <div className="metric-calc-val">{factorData.primeFactorsFormula}</div>
              <span className="metric-meaning">
                Sum of prime powers (<strong>{factorData.primeFactorsCount}</strong>)
              </span>
            </div>

            <div className="factor-metric-card">
              <span className="metric-tag">Distinct Primes</span>
              <div className="metric-calc-val">
                {factorData.distinctPrimes.join(", ")}
              </div>
              <span className="metric-meaning">
                <strong>{factorData.distinctPrimesCount}</strong> distinct prime bases
              </span>
            </div>
          </div>

          {/* Factor List & Summary */}
          <div className="factor-list-section">
            <div className="factor-list-header">
              <h4>All {factorData.totalFactorsCount} Factors of {factorData.number}</h4>
              <span className="sum-tag">
                Sum = <strong>{factorData.sumOfFactors.toLocaleString()}</strong>
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

