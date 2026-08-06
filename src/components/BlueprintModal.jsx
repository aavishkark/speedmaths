import { useState } from "react";
import { IconCross, IconLightning, IconTarget } from "./Icons";
import {
  highYieldMultiplicationSeries,
  corePowerGroups,
  fractionRows,
  highYieldFractionRows,
  numberSystemFormulas,
} from "../data/speedMath";

const range = (start, end) =>
  Array.from({ length: end - start + 1 }, (_, index) => start + index);

export function BlueprintModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("page1"); // 'page1', 'page2', 'page3'
  const [maskMode, setMaskMode] = useState(false);
  const [revealed, setRevealed] = useState({});

  if (!isOpen) return null;

  const toggleCell = (id) => {
    setRevealed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isVisible = (id) => !maskMode || !!revealed[id];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div
        className="modal-card blueprint-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="blueprint-modal-header">
          <div className="blueprint-brand">
            <span className="blueprint-top-badge">
              <IconLightning size={14} />
              <span>Official Cheat Sheet</span>
            </span>
            <h2 className="blueprint-title">CAT SPEED MATH BLUEPRINT</h2>
            <p className="blueprint-subtitle">
              Optimized Memorization Tables & Quick Recall System
            </p>
          </div>

          <div className="blueprint-header-actions">
            <button
              className={`blueprint-action-btn ${maskMode ? "active" : ""}`}
              onClick={() => {
                setMaskMode(!maskMode);
                setRevealed({});
              }}
              type="button"
              title="Mask answers for active self-testing"
            >
              <IconTarget size={15} />
              <span>{maskMode ? "Unmask Values" : "Mask Values (Self-Quiz)"}</span>
            </button>

            <button
              className="blueprint-action-btn print-btn"
              onClick={handlePrint}
              type="button"
              title="Print Blueprint"
            >
              <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" />
              </svg>
              <span>Print Sheet</span>
            </button>

            <button
              className="modal-close-btn"
              onClick={onClose}
              type="button"
              aria-label="Close Blueprint"
            >
              <IconCross size={18} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="blueprint-nav-tabs">
          <button
            className={`blueprint-tab-btn ${activeTab === "page1" ? "active" : ""}`}
            onClick={() => setActiveTab("page1")}
            type="button"
          >
            Page 1 & 2: Multiplication
          </button>
          <button
            className={`blueprint-tab-btn ${activeTab === "page2" ? "active" : ""}`}
            onClick={() => setActiveTab("page2")}
            type="button"
          >
            Page 3 & 4: Exponents & Powers
          </button>
          <button
            className={`blueprint-tab-btn ${activeTab === "page3" ? "active" : ""}`}
            onClick={() => setActiveTab("page3")}
            type="button"
          >
            Page 5 & 6: Fractions & Factors
          </button>
        </div>

        {/* Tab Content */}
        <div className="blueprint-sheet-content">
          {/* TAB 1: MULTIPLICATION */}
          {activeTab === "page1" && (
            <div className="blueprint-page-section">
              {/* Protocol Banner */}
              <div className="blueprint-protocol-box">
                <strong>Protocol for Multiplication:</strong> Do not read these row by row.
                Pick random cells and train your brain for instant recognition (e.g., seeing{" "}
                <strong>136</strong> should instantly trigger <strong>17 × 8</strong>).
              </div>

              {/* 1. The 11 to 20 Grid */}
              <div className="blueprint-block">
                <h3 className="blueprint-block-title">1. The 11 to 20 Grid</h3>
                <div className="blueprint-table-container">
                  <table className="bp-grid-table">
                    <thead>
                      <tr>
                        <th>×</th>
                        {range(1, 10).map((n) => (
                          <th key={`bp-head-${n}`}>{n}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {range(11, 20).map((row) => (
                        <tr key={`bp-row-${row}`}>
                          <td className="bp-row-head">{row}</td>
                          {range(1, 10).map((col) => {
                            const val = row * col;
                            const id = `bp-mul-${row}-${col}`;
                            const show = isVisible(id);
                            return (
                              <td
                                key={id}
                                className={`bp-cell ${!show ? "bp-masked" : ""}`}
                                onClick={() => maskMode && toggleCell(id)}
                              >
                                {show ? val : "?"}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 2. High-Yield Higher Multiples */}
              <div className="blueprint-block">
                <h3 className="blueprint-block-title">2. High-Yield Higher Multiples</h3>
                <div className="blueprint-multiples-grid">
                  {highYieldMultiplicationSeries.map((s) => (
                    <div className="bp-series-card" key={s.seriesName}>
                      <div className="bp-series-head">{s.seriesName}</div>
                      <div className="bp-series-body">
                        {s.items.map((item, i) => {
                          const id = `bp-hy-${s.seriesName}-${i}`;
                          const show = isVisible(id);
                          return (
                            <div
                              className="bp-multi-row"
                              key={item.exp}
                              onClick={() => maskMode && toggleCell(id)}
                            >
                              <span className="bp-exp">{item.exp} =</span>
                              <span
                                className={`bp-val bp-orange ${!show ? "bp-masked-pill" : ""}`}
                              >
                                {show ? item.val : "?"}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EXPONENTS & POWERS */}
          {activeTab === "page2" && (
            <div className="blueprint-page-section">
              {/* 3. Squares (1 to 30) */}
              <div className="blueprint-block">
                <h3 className="blueprint-block-title">3. Squares (1 to 30)</h3>
                <div className="blueprint-table-container">
                  <table className="bp-squares-table">
                    <thead>
                      <tr>
                        <th>x</th>
                        <th>x²</th>
                        <th>x</th>
                        <th>x²</th>
                        <th className="bp-orange-head">x</th>
                        <th className="bp-orange-head">x²</th>
                      </tr>
                    </thead>
                    <tbody>
                      {range(1, 10).map((i) => {
                        const id1 = `bpsq-${i}`;
                        const id2 = `bpsq-${i + 10}`;
                        const id3 = `bpsq-${i + 20}`;
                        return (
                          <tr key={`bpsq-r-${i}`}>
                            <td className="bp-num">{i}</td>
                            <td
                              className={`bp-val ${!isVisible(id1) ? "bp-masked" : ""}`}
                              onClick={() => maskMode && toggleCell(id1)}
                            >
                              {isVisible(id1) ? i ** 2 : "?"}
                            </td>

                            <td className="bp-num">{i + 10}</td>
                            <td
                              className={`bp-val ${!isVisible(id2) ? "bp-masked" : ""}`}
                              onClick={() => maskMode && toggleCell(id2)}
                            >
                              {isVisible(id2) ? (i + 10) ** 2 : "?"}
                            </td>

                            <td className="bp-num bp-orange-bg">{i + 20}</td>
                            <td
                              className={`bp-val bp-orange-bg bp-orange ${
                                !isVisible(id3) ? "bp-masked" : ""
                              }`}
                              onClick={() => maskMode && toggleCell(id3)}
                            >
                              {isVisible(id3) ? (i + 20) ** 2 : "?"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 4. Cubes & 5. Core Powers Split */}
              <div className="blueprint-two-col-grid">
                {/* 4. Cubes (1 to 15) */}
                <div className="blueprint-block">
                  <h3 className="blueprint-block-title">4. Cubes (1 to 15)</h3>
                  <div className="blueprint-table-container">
                    <table className="bp-cubes-table">
                      <thead>
                        <tr>
                          <th>x</th>
                          <th>x³</th>
                        </tr>
                      </thead>
                      <tbody>
                        {range(1, 15).map((num) => {
                          const id = `bpcube-${num}`;
                          const isHigh = num >= 11;
                          return (
                            <tr key={`bpcube-${num}`} className={isHigh ? "bp-highlight-row" : ""}>
                              <td className={`bp-num ${isHigh ? "bp-orange-bg" : ""}`}>{num}</td>
                              <td
                                className={`bp-val ${isHigh ? "bp-orange bp-orange-bg" : ""} ${
                                  !isVisible(id) ? "bp-masked" : ""
                                }`}
                                onClick={() => maskMode && toggleCell(id)}
                              >
                                {isVisible(id) ? num ** 3 : "?"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 5. Core Powers (2, 3, 5) */}
                <div className="blueprint-block">
                  <h3 className="blueprint-block-title">5. Core Powers (2, 3, 5)</h3>
                  <div className="blueprint-table-container">
                    <table className="bp-powers-table">
                      <thead>
                        <tr>
                          <th>Power</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {corePowerGroups.map((grp) => (
                          <>
                            <tr className="bp-group-head-row" key={`grp-intro-${grp.base}`}>
                              <td className="bp-intro-exp">{grp.intro.split("=")[0]}</td>
                              <td className="bp-intro-val">{grp.intro.split("=")[1]}</td>
                            </tr>
                            {grp.powers.map((p) => {
                              const id = `bpp-${p.exp}`;
                              return (
                                <tr key={p.exp}>
                                  <td className="bp-power-exp">{p.exp}</td>
                                  <td
                                    className={`bp-val bp-orange ${
                                      !isVisible(id) ? "bp-masked" : ""
                                    }`}
                                    onClick={() => maskMode && toggleCell(id)}
                                  >
                                    {isVisible(id) ? p.val : "?"}
                                  </td>
                                </tr>
                              );
                            })}
                          </>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FRACTIONS & FACTORS */}
          {activeTab === "page3" && (
            <div className="blueprint-page-section">
              {/* 6. Fraction to Percentage (1/1 to 1/20) */}
              <div className="blueprint-block">
                <h3 className="blueprint-block-title">6. Fraction to Percentage (1/1 to 1/20)</h3>
                <div className="blueprint-two-col-grid">
                  <div className="blueprint-table-container">
                    <table className="bp-frac-table">
                      <thead>
                        <tr>
                          <th>Fraction</th>
                          <th>Decimal</th>
                          <th>Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fractionRows.slice(0, 10).map(([f, dec, pct, alt]) => {
                          const id = `bpfrac-${f}`;
                          return (
                            <tr key={f}>
                              <td className="bp-frac-label">{f}</td>
                              <td className="bp-dec-label">{dec}</td>
                              <td
                                className={`bp-val bp-orange ${!isVisible(id) ? "bp-masked" : ""}`}
                                onClick={() => maskMode && toggleCell(id)}
                              >
                                {isVisible(id) ? (
                                  <>
                                    <span>{pct}</span>
                                    {alt && <span className="bp-alt"> ({alt})</span>}
                                  </>
                                ) : (
                                  "?"
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="blueprint-table-container">
                    <table className="bp-frac-table">
                      <thead>
                        <tr>
                          <th>Fraction</th>
                          <th>Decimal</th>
                          <th>Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fractionRows.slice(10, 20).map(([f, dec, pct, alt]) => {
                          const id = `bpfrac-${f}`;
                          return (
                            <tr key={f}>
                              <td className="bp-frac-label">{f}</td>
                              <td className="bp-dec-label">{dec}</td>
                              <td
                                className={`bp-val bp-orange ${!isVisible(id) ? "bp-masked" : ""}`}
                                onClick={() => maskMode && toggleCell(id)}
                              >
                                {isVisible(id) ? (
                                  <>
                                    <span>{pct}</span>
                                    {alt && <span className="bp-alt"> ({alt})</span>}
                                  </>
                                ) : (
                                  "?"
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* 7. High-Yield Multiples & 8. Formulas Split */}
              <div className="blueprint-two-col-grid">
                {/* 7. High-Yield Multiples */}
                <div className="blueprint-block">
                  <h3 className="blueprint-block-title">7. High-Yield Multiples</h3>
                  <div className="blueprint-table-container">
                    <table className="bp-hyf-table">
                      <thead>
                        <tr>
                          <th>Fraction</th>
                          <th>Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {highYieldFractionRows.map(([f, _dec, pct]) => {
                          const id = `bphyf-${f}`;
                          return (
                            <tr key={f}>
                              <td className="bp-frac-label bold">{f}</td>
                              <td
                                className={`bp-val bp-orange bold ${
                                  !isVisible(id) ? "bp-masked" : ""
                                }`}
                                onClick={() => maskMode && toggleCell(id)}
                              >
                                {isVisible(id) ? pct : "?"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 8. Number System Formulas */}
                <div className="blueprint-block">
                  <h3 className="blueprint-block-title">8. Number System Formulas</h3>
                  <div className="bp-formula-box">
                    <div className="bp-formula-head">
                      <span className="bp-formula-label">Prime Factorization format:</span>
                      <div className="bp-formula-hero">{numberSystemFormulas.primeFormat}</div>
                      <span className="bp-formula-note">{numberSystemFormulas.note}</span>
                    </div>

                    <div className="bp-formula-rules">
                      <div className="bp-rule-row">
                        <span className="bp-rule-bullet">•</span>
                        <div>
                          <strong>Total Factors:</strong>
                          <div className="bp-rule-code">(a + 1)(b + 1)(c + 1)</div>
                        </div>
                      </div>

                      <div className="bp-rule-row">
                        <span className="bp-rule-bullet">•</span>
                        <div>
                          <strong>Total Prime Factors:</strong>
                          <div className="bp-rule-code">a + b + c</div>
                        </div>
                      </div>

                      <div className="bp-rule-row">
                        <span className="bp-rule-bullet">•</span>
                        <div>
                          <strong>Distinct Prime Factors:</strong>
                          <div className="bp-rule-code">3 (p, q, and r)</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="blueprint-modal-footer">
          <span className="blueprint-tip-text">
            💡 <strong>Pro-Tip:</strong> Click &quot;Mask Values&quot; above to hide answers and test your speed recall directly on each table!
          </span>
          <button className="primary-action" onClick={onClose} type="button">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
