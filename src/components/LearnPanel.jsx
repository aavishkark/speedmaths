import { useState } from "react";
import { IconFlame, IconLightning, IconTarget } from "./Icons";

export function LearnPanel({ topic }) {
  const [filterText, setFilterText] = useState("");
  const [maskAnswers, setMaskAnswers] = useState(false);
  const [revealedCells, setRevealedCells] = useState({});
  const [spottedCell, setSpottedCell] = useState(null);

  const normalizedFilter = filterText.toLowerCase().trim();

  const toggleReveal = (id) => {
    setRevealedCells((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSpotRandomCell = () => {
    // Pick a random row and col from 11-20 grid or random fact
    if (topic.id === "multiplication") {
      const row = Math.floor(Math.random() * 10) + 11;
      const col = Math.floor(Math.random() * 10) + 1;
      setSpottedCell({ row, col, product: row * col });
    } else {
      const randomFact = topic.facts[Math.floor(Math.random() * topic.facts.length)];
      setSpottedCell({
        label: randomFact.question.replace(" = ?", ""),
        value: randomFact.answer,
      });
    }
  };

  const isRevealed = (id) => !maskAnswers || !!revealedCells[id];

  return (
    <section className="learn-panel" aria-label={`${topic.name} table`}>
      {/* Blueprint Page Tag & Protocol Banner */}
      {topic.protocol && (
        <div className="blueprint-protocol-card">
          <div className="protocol-header">
            <span className="protocol-badge">
              <IconLightning size={14} />
              <span>{topic.blueprintPage || "CAT Speed Math Blueprint"}</span>
            </span>
            <span className="protocol-label">Protocol & Memorization Rule</span>
          </div>
          <p className="protocol-text">
            <strong>Rule: </strong>
            {topic.protocol}
          </p>
        </div>
      )}

      {/* Interactive Toolbar */}
      <div className="learn-toolbar-row">
        <div className="learn-filter-bar">
          <input
            type="text"
            className="learn-filter-input"
            placeholder="Filter values, formulas, or numbers..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
          {filterText && (
            <button
              className="filter-clear-btn"
              onClick={() => setFilterText("")}
              type="button"
            >
              Clear
            </button>
          )}
        </div>

        <div className="learn-action-buttons">
          <button
            className={`toolbar-toggle-btn ${maskAnswers ? "active" : ""}`}
            onClick={() => {
              setMaskAnswers(!maskAnswers);
              setRevealedCells({});
            }}
            type="button"
            title="Hide values so you can test your recall directly on the table"
          >
            <IconTarget size={14} />
            <span>{maskAnswers ? "Revealing Masked" : "Mask (Self-Quiz)"}</span>
          </button>

          <button
            className="toolbar-toggle-btn spotter-btn"
            onClick={handleSpotRandomCell}
            type="button"
            title="Spot a random item for rapid flash recall"
          >
            <IconFlame size={14} />
            <span>Spot Random Cell</span>
          </button>
        </div>
      </div>

      {/* Spotted Cell Flash Banner */}
      {spottedCell && (
        <div className="spotted-flash-banner">
          <div className="spotted-info">
            <span className="spotted-tag">Rapid Spotter</span>
            <span className="spotted-prompt">
              {spottedCell.row
                ? `What is ${spottedCell.row} × ${spottedCell.col} ?`
                : `What is ${spottedCell.label} ?`}
            </span>
          </div>
          <div className="spotted-answer-block">
            {revealedCells.spotted ? (
              <span className="spotted-val">
                {spottedCell.product || spottedCell.value}
              </span>
            ) : (
              <button
                className="reveal-btn"
                onClick={() => toggleReveal("spotted")}
                type="button"
              >
                Reveal Answer
              </button>
            )}
            <button
              className="next-spot-btn"
              onClick={() => {
                setRevealedCells((prev) => ({ ...prev, spotted: false }));
                handleSpotRandomCell();
              }}
              type="button"
            >
              Next Spot ➔
            </button>
          </div>
        </div>
      )}

      {/* Sections rendering */}
      {topic.learnSections.map((section, secIdx) => {
        // Section: Grid (Multiplication 11-20)
        if (section.type === "grid") {
          const filteredRows = normalizedFilter
            ? section.rows.filter((row) =>
                row.some((cell) => String(cell).includes(normalizedFilter)),
              )
            : section.rows;

          return (
            <div className="learn-section" key={section.title}>
              <div className="section-heading">
                <h2>{section.title}</h2>
                <span className="row-badge">
                  {filteredRows.length} rows × 10 cols
                </span>
              </div>
              <div className="table-wrap dense blueprint-table">
                <table>
                  <thead>
                    <tr>
                      {section.headers.map((header, index) => (
                        <th key={`head-${index}`}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.map((row, rowIndex) => (
                      <tr key={`grid-row-${rowIndex}`}>
                        <td className="row-header-cell">{row[0]}</td>
                        {row.slice(1).map((val, cellIdx) => {
                          const cellId = `grid-${row[0]}-${cellIdx + 1}`;
                          const isSpotted =
                            spottedCell?.row === row[0] &&
                            spottedCell?.col === cellIdx + 1;
                          const showVal = isRevealed(cellId);

                          return (
                            <td
                              key={cellId}
                              className={`matrix-cell ${isSpotted ? "spotted-highlight" : ""} ${
                                !showVal ? "masked-cell" : ""
                              }`}
                              onClick={() => maskAnswers && toggleReveal(cellId)}
                              title={
                                maskAnswers
                                  ? "Click to reveal"
                                  : `${row[0]} × ${cellIdx + 1} = ${val}`
                              }
                            >
                              {showVal ? val : "?"}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }

        // Section: High-Yield Series Cards (15s, 16s, 24s/25s)
        if (section.type === "seriesCards") {
          return (
            <div className="learn-section" key={section.title}>
              <div className="section-heading">
                <h2>{section.title}</h2>
                <span className="row-badge">High-Yield</span>
              </div>
              <div className="series-cards-grid">
                {section.series.map((s) => (
                  <div className="series-card" key={s.seriesName}>
                    <div className="series-header">{s.seriesName}</div>
                    <div className="series-items-list">
                      {s.items.map((item, i) => {
                        const cellId = `series-${s.seriesName}-${i}`;
                        const showVal = isRevealed(cellId);
                        return (
                          <div
                            className="series-item-row"
                            key={item.exp}
                            onClick={() => maskAnswers && toggleReveal(cellId)}
                          >
                            <span className="series-exp">{item.exp} =</span>
                            <span
                              className={`series-val highlighted-val ${
                                !showVal ? "masked-pill" : ""
                              }`}
                            >
                              {showVal ? item.val : "?"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        // Section: Squares Grid (3 columns: 1-10, 11-20, 21-30 highlighted)
        if (section.type === "squaresGrid") {
          return (
            <div className="learn-section" key={section.title}>
              <div className="section-heading">
                <h2>{section.title}</h2>
                <span className="row-badge">1 to 30</span>
              </div>
              <div className="table-wrap squares-blueprint-table">
                <table>
                  <thead>
                    <tr>
                      <th>x</th>
                      <th>x²</th>
                      <th>x</th>
                      <th>x²</th>
                      <th className="highlight-col-head">x</th>
                      <th className="highlight-col-head">x²</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.rows.map((r, i) => {
                      const id1 = `sq-${r[0]}`;
                      const id2 = `sq-${r[2]}`;
                      const id3 = `sq-${r[4]}`;
                      return (
                        <tr key={`sq-row-${i}`}>
                          <td className="number-col">{r[0]}</td>
                          <td
                            className={`val-col ${!isRevealed(id1) ? "masked-cell" : ""}`}
                            onClick={() => maskAnswers && toggleReveal(id1)}
                          >
                            {isRevealed(id1) ? r[1] : "?"}
                          </td>

                          <td className="number-col">{r[2]}</td>
                          <td
                            className={`val-col ${!isRevealed(id2) ? "masked-cell" : ""}`}
                            onClick={() => maskAnswers && toggleReveal(id2)}
                          >
                            {isRevealed(id2) ? r[3] : "?"}
                          </td>

                          <td className="number-col highlight-cell">{r[4]}</td>
                          <td
                            className={`val-col highlight-cell highlighted-val ${
                              !isRevealed(id3) ? "masked-cell" : ""
                            }`}
                            onClick={() => maskAnswers && toggleReveal(id3)}
                          >
                            {isRevealed(id3) ? r[5] : "?"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }

        // Section: Cubes List (1 to 15)
        if (section.type === "cubesList") {
          return (
            <div className="learn-section" key={section.title}>
              <div className="section-heading">
                <h2>{section.title}</h2>
                <span className="row-badge">1 to 15</span>
              </div>
              <div className="cubes-split-grid">
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>x</th>
                        <th>x³</th>
                      </tr>
                    </thead>
                    <tbody>
                      {section.rows.slice(0, 8).map(([num, cube]) => {
                        const id = `cube-${num}`;
                        return (
                          <tr key={`cube-${num}`}>
                            <td className="number-col">{num}</td>
                            <td
                              className={`val-col ${
                                !isRevealed(id) ? "masked-cell" : ""
                              }`}
                              onClick={() => maskAnswers && toggleReveal(id)}
                            >
                              {isRevealed(id) ? cube : "?"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>x</th>
                        <th>x³</th>
                      </tr>
                    </thead>
                    <tbody>
                      {section.rows.slice(8).map(([num, cube, isHighYield]) => {
                        const id = `cube-${num}`;
                        return (
                          <tr
                            key={`cube-${num}`}
                            className={isHighYield ? "high-yield-row" : ""}
                          >
                            <td
                              className={`number-col ${
                                isHighYield ? "highlight-cell" : ""
                              }`}
                            >
                              {num}
                            </td>
                            <td
                              className={`val-col ${
                                isHighYield ? "highlighted-val highlight-cell" : ""
                              } ${!isRevealed(id) ? "masked-cell" : ""}`}
                              onClick={() => maskAnswers && toggleReveal(id)}
                            >
                              {isRevealed(id) ? cube : "?"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        }

        // Section: Core Powers (2, 3, 5)
        if (section.type === "powerGroups") {
          return (
            <div className="learn-section" key={section.title}>
              <div className="section-heading">
                <h2>{section.title}</h2>
                <span className="row-badge">Bases 2, 3, 5</span>
              </div>
              <div className="powers-cards-grid">
                {section.groups.map((group) => (
                  <div className="power-group-card" key={`power-${group.base}`}>
                    <div className="power-group-header">
                      <h3>Base {group.base}</h3>
                      <span className="power-intro-pill">{group.intro}</span>
                    </div>
                    <div className="power-items-list">
                      {group.powers.map((p) => {
                        const id = `p-${p.exp}`;
                        const show = isRevealed(id);
                        return (
                          <div
                            className="power-item-row"
                            key={p.exp}
                            onClick={() => maskAnswers && toggleReveal(id)}
                          >
                            <span className="power-exp">{p.exp}</span>
                            <span
                              className={`power-val highlighted-val ${
                                !show ? "masked-pill" : ""
                              }`}
                            >
                              {show ? p.val : "?"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        // Section: Fraction to Percentage Two-Column
        if (section.type === "fractionTwoCol") {
          return (
            <div className="learn-section" key={section.title}>
              <div className="section-heading">
                <h2>{section.title}</h2>
                <span className="row-badge">1/1 to 1/20</span>
              </div>
              <div className="fractions-two-col-grid">
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Fraction</th>
                        <th>Decimal</th>
                        <th>Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {section.col1.map(([f, dec, pct, alt]) => {
                        const id = `frac-${f}`;
                        return (
                          <tr key={f}>
                            <td className="fraction-label">{f}</td>
                            <td className="decimal-label">{dec}</td>
                            <td
                              className={`percentage-label highlighted-val ${
                                !isRevealed(id) ? "masked-cell" : ""
                              }`}
                              onClick={() => maskAnswers && toggleReveal(id)}
                            >
                              {isRevealed(id) ? (
                                <>
                                  <span>{pct}</span>
                                  {alt && <span className="alt-pct"> ({alt})</span>}
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

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Fraction</th>
                        <th>Decimal</th>
                        <th>Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {section.col2.map(([f, dec, pct, alt]) => {
                        const id = `frac-${f}`;
                        return (
                          <tr key={f}>
                            <td className="fraction-label">{f}</td>
                            <td className="decimal-label">{dec}</td>
                            <td
                              className={`percentage-label highlighted-val ${
                                !isRevealed(id) ? "masked-cell" : ""
                              }`}
                              onClick={() => maskAnswers && toggleReveal(id)}
                            >
                              {isRevealed(id) ? (
                                <>
                                  <span>{pct}</span>
                                  {alt && <span className="alt-pct"> ({alt})</span>}
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
          );
        }

        // Section: High-Yield Fractions
        if (section.type === "highYieldFractions") {
          return (
            <div className="learn-section" key={section.title}>
              <div className="section-heading">
                <h2>{section.title}</h2>
                <span className="row-badge">Essential High-Yield</span>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Fraction</th>
                      <th>Percentage</th>
                      <th>Decimal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.rows.map(([f, dec, pct, alt]) => {
                      const id = `hyf-${f}`;
                      return (
                        <tr key={f}>
                          <td className="fraction-label bold-fraction">{f}</td>
                          <td
                            className={`percentage-label highlighted-val ${
                              !isRevealed(id) ? "masked-cell" : ""
                            }`}
                            onClick={() => maskAnswers && toggleReveal(id)}
                          >
                            {isRevealed(id) ? (
                              <>
                                <strong>{pct}</strong>
                                {alt && <span className="alt-pct"> ({alt})</span>}
                              </>
                            ) : (
                              "?"
                            )}
                          </td>
                          <td className="decimal-label">{dec}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }

        // Section: Number System Formula Card (Page 6)
        if (section.type === "formulaCard") {
          const { data } = section;
          return (
            <div className="learn-section" key={section.title}>
              <div className="section-heading">
                <h2>{section.title}</h2>
                <span className="row-badge">Page 6 Blueprint</span>
              </div>

              <div className="formula-blueprint-card">
                <div className="formula-card-top">
                  <span className="formula-card-label">Prime Factorization format:</span>
                  <div className="formula-hero-expression">{data.primeFormat}</div>
                  <span className="formula-card-note">{data.note}</span>
                </div>

                <div className="formula-rules-list">
                  {data.rules.map((rule) => (
                    <div className="formula-rule-item" key={rule.name}>
                      <div className="rule-bullet-title">
                        <span className="bullet-dot">•</span>
                        <strong>{rule.name}:</strong>
                      </div>
                      <div className="rule-math-formula">{rule.formula}</div>
                      <p className="rule-explanation">{rule.explanation}</p>
                    </div>
                  ))}
                </div>

                <div className="formula-examples-box">
                  <h4 className="examples-header">Worked Blueprint Examples:</h4>
                  <div className="examples-grid">
                    {data.examples.map((ex) => (
                      <div className="example-card" key={ex.expression}>
                        <div className="example-exp">{ex.expression}</div>
                        <div className="example-calc">{ex.calculation}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        }

        // Default / Mixed Fallback
        return (
          <div className="learn-section" key={`sec-${secIdx}`}>
            <div className="section-heading">
              <h2>{section.title}</h2>
            </div>
            <div className="table-wrap">
              <table>
                <tbody>
                  {section.rows?.map((row, i) => (
                    <tr key={`mixed-${i}`}>
                      {row.map((c, j) => (
                        <td key={`c-${j}`}>{c}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </section>
  );
}
