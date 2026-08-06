import { useState, useEffect, useMemo } from "react";
import {
  IconFlame,
  IconLightning,
  IconTarget,
  IconStar,
  IconBulb,
  IconLayers,
  IconGrid,
  IconChevronDown,
  IconCheck,
  IconSparkles,
} from "./Icons";
import {
  ALL_LEARN_SECTIONS,
  TOPICS,
  ALL_FACTS,
  FRACTION_FAMILIES,
  MENTAL_TRICKS,
} from "../data/speedMath";
import { FactorSandbox } from "./FactorSandbox";

const STORAGE_STARRED_KEY = "speedmath_starred_facts";

function loadStarredFacts() {
  try {
    const raw = localStorage.getItem(STORAGE_STARRED_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStarredFacts(data) {
  try {
    localStorage.setItem(STORAGE_STARRED_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage quota
  }
}

export function LearnPanel({ topic }) {
  const [activeTab, setActiveTab] = useState(() =>
    topic.id === "mixed" ? "all" : topic.id,
  );
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'family' | 'flashcards'
  const [filterText, setFilterText] = useState("");
  const [maskAnswers, setMaskAnswers] = useState(false);
  const [revealedCells, setRevealedCells] = useState({});
  const [spottedCell, setSpottedCell] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [showTricks, setShowTricks] = useState(true);
  const [starredFacts, setStarredFacts] = useState(loadStarredFacts);

  // Sync if parent topic changes
  useEffect(() => {
    if (topic.id === "mixed") {
      setActiveTab("all");
    } else {
      setActiveTab(topic.id);
    }
  }, [topic.id]);

  const starredCount = useMemo(
    () => Object.keys(starredFacts).filter((k) => starredFacts[k]).length,
    [starredFacts],
  );

  const TABLE_TABS = [
    { id: "all", label: "All Tables", badge: "8 Tables" },
    { id: "multiplication", label: "Multiplication", badge: "1-20 & Multiples" },
    { id: "squares", label: "Squares", badge: "1² - 30²" },
    { id: "cubes", label: "Cubes", badge: "1³ - 15³" },
    { id: "powers", label: "Powers", badge: "2, 3, 5" },
    { id: "fractions", label: "Fractions", badge: "1/1 - 1/20" },
    { id: "factors", label: "Factors", badge: "Sandbox & Rules" },
    { id: "starred", label: "⭐ My Starred Facts", badge: `${starredCount} saved` },
  ];

  const normalizedFilter = filterText.toLowerCase().trim();

  const toggleStar = (factKey, factObj = null) => {
    setStarredFacts((prev) => {
      const next = { ...prev };
      if (next[factKey]) {
        delete next[factKey];
      } else {
        next[factKey] = factObj || true;
      }
      saveStarredFacts(next);
      return next;
    });
  };

  const isStarred = (factKey) => !!starredFacts[factKey];

  const toggleReveal = (id) => {
    setRevealedCells((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isRevealed = (id) => !maskAnswers || !!revealedCells[id];

  const currentTopicObj = TOPICS.find((t) => t.id === activeTab) || topic;
  const currentTricks = MENTAL_TRICKS[activeTab] || (activeTab === "all" ? MENTAL_TRICKS.multiplication : []);

  // Determine sections
  const sectionsToRender = useMemo(() => {
    if (activeTab === "all") {
      return ALL_LEARN_SECTIONS;
    }
    if (activeTab === "starred") {
      return [];
    }
    const topicObj = TOPICS.find((t) => t.id === activeTab) || topic;
    return topicObj.learnSections || [];
  }, [activeTab, topic]);

  // Starred Facts list for active recall
  const starredList = useMemo(() => {
    return ALL_FACTS.filter((fact) => isStarred(fact.id || `${fact.topicId}-${fact.question}`));
  }, [starredFacts]);

  const handleSpotRandomCell = () => {
    if (activeTab === "multiplication" || (activeTab === "all" && Math.random() > 0.6)) {
      const row = Math.floor(Math.random() * 10) + 11;
      const col = Math.floor(Math.random() * 10) + 1;
      setSpottedCell({ row, col, product: row * col });
    } else if (activeTab === "starred" && starredList.length > 0) {
      const randomFact = starredList[Math.floor(Math.random() * starredList.length)];
      setSpottedCell({
        label: randomFact.question.replace(" = ?", ""),
        value: randomFact.answer,
      });
    } else {
      const factPool =
        activeTab === "all"
          ? ALL_FACTS
          : currentTopicObj.facts || ALL_FACTS;
      const randomFact = factPool[Math.floor(Math.random() * factPool.length)];
      setSpottedCell({
        label: randomFact.question.replace(" = ?", ""),
        value: randomFact.answer,
      });
    }
  };

  return (
    <section className="learn-panel" aria-label="Learn Tables Workspace">
      {/* Table Navigation Bar: All Tables vs Specific Table vs Starred */}
      <div className="learn-tabs-nav">
        {TABLE_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`learn-tab-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => {
              setActiveTab(tab.id);
              setFilterText("");
            }}
          >
            <span className="learn-tab-title">{tab.label}</span>
            <span className="learn-tab-badge">{tab.badge}</span>
          </button>
        ))}
      </div>

      {/* Protocol Banner */}
      {currentTopicObj.protocol && activeTab !== "starred" && (
        <div className="blueprint-protocol-card">
          <div className="protocol-header">
            <span className="protocol-badge">
              <IconLightning size={14} />
              <span>{currentTopicObj.blueprintPage || "CAT Speed Math Blueprint"}</span>
            </span>
            <span className="protocol-label">
              {activeTab === "all" ? "Blueprint Mastery Rule" : "Protocol & Memorization Rule"}
            </span>
          </div>
          <p className="protocol-text">
            <strong>Rule: </strong>
            {currentTopicObj.protocol}
          </p>
        </div>
      )}

      {/* Mental Math Shortcuts & Memorization Hacks Accordion */}
      {currentTricks && currentTricks.length > 0 && activeTab !== "starred" && (
        <div className="mental-tricks-accordion">
          <button
            type="button"
            className="tricks-header-toggle"
            onClick={() => setShowTricks(!showTricks)}
          >
            <div className="tricks-header-title">
              <span className="tricks-icon-pill">
                <IconBulb size={15} />
              </span>
              <span>Mental Shortcuts & Memorization Hacks</span>
              <span className="tricks-count-badge">{currentTricks.length} hacks</span>
            </div>
            <span className={`accordion-chevron ${showTricks ? "open" : ""}`}>
              <IconChevronDown size={16} />
            </span>
          </button>

          {showTricks && (
            <div className="tricks-content-grid">
              {currentTricks.map((trick) => (
                <div className="trick-card" key={trick.title}>
                  <div className="trick-card-top">
                    <span className="trick-title">{trick.title}</span>
                    <span className="trick-badge">{trick.badge}</span>
                  </div>
                  <p className="trick-rule">
                    <strong>Shortcut: </strong>
                    {trick.rule}
                  </p>
                  <div className="trick-example-box">
                    <span className="trick-ex-label">Example: </span>
                    <span className="trick-ex-content">{trick.example}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Interactive Toolbar */}
      <div className="learn-toolbar-row">
        <div className="learn-filter-bar">
          <input
            type="text"
            className="learn-filter-input"
            placeholder={
              activeTab === "all"
                ? "Search across all tables, formulas, or numbers..."
                : activeTab === "starred"
                ? "Filter starred facts..."
                : `Filter ${currentTopicObj.name} values or formulas...`
            }
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

        {/* View Mode Switcher */}
        <div className="view-mode-selector">
          <button
            type="button"
            className={`view-mode-btn ${viewMode === "table" ? "active" : ""}`}
            onClick={() => setViewMode("table")}
            title="Standard Tables & Matrices"
          >
            <IconGrid size={14} />
            <span>Table</span>
          </button>

          {(activeTab === "fractions" || activeTab === "all") && (
            <button
              type="button"
              className={`view-mode-btn ${viewMode === "family" ? "active" : ""}`}
              onClick={() => setViewMode("family")}
              title="Fraction Families with Visual % Bars"
            >
              <IconLayers size={14} />
              <span>Families</span>
            </button>
          )}

          <button
            type="button"
            className={`view-mode-btn ${viewMode === "flashcards" ? "active" : ""}`}
            onClick={() => setViewMode("flashcards")}
            title="Interactive Flashcards Deck"
          >
            <IconSparkles size={14} />
            <span>Flashcards</span>
          </button>
        </div>

        <div className="learn-action-buttons">
          <button
            className={`toolbar-toggle-btn ${maskAnswers ? "active" : ""}`}
            onClick={() => {
              setMaskAnswers(!maskAnswers);
              setRevealedCells({});
            }}
            type="button"
            title="Hide values so you can test your recall directly on the tables"
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

      {/* VIEW MODE 1: STARRED VIEW */}
      {activeTab === "starred" && (
        <div className="starred-deck-section">
          {starredList.length === 0 ? (
            <div className="starred-empty-card">
              <div className="empty-star-icon">
                <IconStar size={36} />
              </div>
              <h3>No Starred Facts Yet</h3>
              <p>
                Click the <strong>⭐ star icon</strong> on any fact or calculation in the tables
                to add it here for targeted daily revision!
              </p>
            </div>
          ) : (
            <div className="starred-facts-grid">
              <div className="section-heading">
                <h2>My Starred High-Priority Facts ({starredList.length})</h2>
                <span className="row-badge">Personal Deck</span>
              </div>
              <div className="flashcards-deck-grid">
                {starredList.map((fact) => {
                  const factKey = fact.id || `${fact.topicId}-${fact.question}`;
                  const isRev = isRevealed(factKey);
                  return (
                    <div className="flashcard-item" key={factKey}>
                      <div className="flashcard-top">
                        <span className="flashcard-topic">{fact.topicId}</span>
                        <button
                          type="button"
                          className="star-toggle-btn active"
                          onClick={() => toggleStar(factKey)}
                          title="Remove from Starred"
                        >
                          <IconStar size={16} filled={true} />
                        </button>
                      </div>
                      <div className="flashcard-question">{fact.question}</div>
                      <div
                        className={`flashcard-answer-box ${!isRev ? "masked" : ""}`}
                        onClick={() => toggleReveal(factKey)}
                      >
                        {isRev ? (
                          <span className="answer-text">{fact.answer}</span>
                        ) : (
                          <span className="reveal-hint">Click to Reveal</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW MODE 2: FLASHCARDS VIEW */}
      {viewMode === "flashcards" && activeTab !== "starred" && (
        <div className="flashcards-deck-section">
          <div className="section-heading">
            <h2>Active Flashcards Recall ({activeTab === "all" ? ALL_FACTS.length : currentTopicObj.facts?.length} Cards)</h2>
            <span className="row-badge">Self-Testing Mode</span>
          </div>
          <div className="flashcards-deck-grid">
            {(activeTab === "all" ? ALL_FACTS : currentTopicObj.facts || [])
              .filter(
                (f) =>
                  !normalizedFilter ||
                  f.question.toLowerCase().includes(normalizedFilter) ||
                  f.answer.toLowerCase().includes(normalizedFilter),
              )
              .slice(0, 100)
              .map((fact) => {
                const factKey = fact.id || `${fact.topicId}-${fact.question}`;
                const isRev = isRevealed(factKey);
                const starred = isStarred(factKey);

                return (
                  <div className="flashcard-item" key={factKey}>
                    <div className="flashcard-top">
                      <span className="flashcard-topic">{fact.topicId}</span>
                      <button
                        type="button"
                        className={`star-toggle-btn ${starred ? "active" : ""}`}
                        onClick={() => toggleStar(factKey, fact)}
                        title={starred ? "Starred" : "Star this fact"}
                      >
                        <IconStar size={16} filled={starred} />
                      </button>
                    </div>
                    <div className="flashcard-question">{fact.question}</div>
                    <div
                      className={`flashcard-answer-box ${!isRev ? "masked" : ""}`}
                      onClick={() => toggleReveal(factKey)}
                    >
                      {isRev ? (
                        <span className="answer-text">{fact.answer}</span>
                      ) : (
                        <span className="reveal-hint">Click to Reveal</span>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* VIEW MODE 3: FRACTION FAMILIES (Pattern & Bar View) */}
      {(viewMode === "family" || (activeTab === "fractions" && viewMode === "family")) && (
        <div className="fraction-families-container">
          <div className="section-heading">
            <h2>Fraction Families & Visual Percentage Fill</h2>
            <span className="row-badge">Pattern Mastery</span>
          </div>

          <div className="families-grid">
            {FRACTION_FAMILIES.map((family) => {
              const matchesFilter =
                !normalizedFilter ||
                family.familyName.toLowerCase().includes(normalizedFilter) ||
                family.mnemonic.toLowerCase().includes(normalizedFilter) ||
                family.items.some(
                  (item) =>
                    item.fraction.includes(normalizedFilter) ||
                    item.percentage.includes(normalizedFilter),
                );

              if (!matchesFilter) return null;

              return (
                <div className="family-card" key={family.familyName}>
                  <div className="family-card-header">
                    <div>
                      <h3 className="family-title">{family.familyName}</h3>
                      <p className="family-mnemonic">
                        <strong>Mnemonic: </strong>
                        {family.mnemonic}
                      </p>
                    </div>
                    <span className="family-tag-badge">{family.tag}</span>
                  </div>

                  <div className="family-items-list">
                    {family.items.map((item) => {
                      const factKey = `frac-fam-${item.fraction}`;
                      const show = isRevealed(factKey);
                      const starred = isStarred(factKey);

                      return (
                        <div
                          className="family-fraction-row"
                          key={item.fraction}
                          onClick={() => maskAnswers && toggleReveal(factKey)}
                        >
                          <div className="fraction-label-col">
                            <span className="fraction-big-pill">{item.fraction}</span>
                          </div>

                          <div className="fraction-bar-col">
                            <div className="fraction-val-row">
                              <span
                                className={`fraction-pct-val highlighted-val ${
                                  !show ? "masked-pill" : ""
                                }`}
                              >
                                {show ? (
                                  <>
                                    <strong>{item.percentage}</strong>
                                    {item.alt && <span className="alt-pct"> ({item.alt})</span>}
                                  </>
                                ) : (
                                  "?"
                                )}
                              </span>
                              <span className="fraction-dec-val">{item.decimal}</span>
                            </div>

                            <div className="percent-bar-track">
                              <div
                                className="percent-bar-fill"
                                style={{ width: `${Math.min(100, item.val)}%` }}
                              />
                            </div>
                          </div>

                          <button
                            type="button"
                            className={`star-mini-btn ${starred ? "active" : ""}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleStar(factKey, {
                                question: `${item.fraction} = ?`,
                                answer: item.percentage,
                                topicId: "fractions",
                              });
                            }}
                            title="Star for quick recall"
                          >
                            <IconStar size={14} filled={starred} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW MODE 4: STANDARD TABLES & MATRICES */}
      {viewMode === "table" && activeTab !== "starred" && (
        <div className="learn-sections-container">
          {/* If Factors tab, render the interactive Factor Sandbox first */}
          {(activeTab === "factors" || activeTab === "all") && (
            <div className="learn-section">
              <FactorSandbox />
            </div>
          )}

          {sectionsToRender.map((section, secIdx) => {
            // Section: Grid (Multiplication 11-20 or 1-10)
            if (section.type === "grid") {
              const filteredRows = normalizedFilter
                ? section.rows.filter((row) =>
                    row.some((cell) => String(cell).includes(normalizedFilter)),
                  )
                : section.rows;

              if (filteredRows.length === 0) return null;

              return (
                <div className="learn-section" key={`${section.title}-${secIdx}`}>
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
                          {section.headers.map((header, index) => {
                            const isColActive = hoveredCell?.col === index && index !== 0;
                            return (
                              <th
                                key={`head-${index}`}
                                className={isColActive ? "crosshair-col-head" : ""}
                              >
                                {header}
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRows.map((row, rowIndex) => {
                          const isRowActive = hoveredCell?.row === row[0];
                          return (
                            <tr
                              key={`grid-row-${rowIndex}`}
                              className={isRowActive ? "crosshair-row-track" : ""}
                            >
                              <td
                                className={`row-header-cell ${
                                  isRowActive ? "crosshair-row-head" : ""
                                }`}
                              >
                                {row[0]}
                              </td>
                              {row.slice(1).map((val, cellIdx) => {
                                const colNum = cellIdx + 1;
                                const cellId = `grid-${row[0]}-${colNum}`;
                                const isSpotted =
                                  spottedCell?.row === row[0] &&
                                  spottedCell?.col === colNum;
                                const isFocused =
                                  hoveredCell?.row === row[0] &&
                                  hoveredCell?.col === colNum;
                                const isColTrack = hoveredCell?.col === colNum;
                                const showVal = isRevealed(cellId);
                                const starred = isStarred(cellId);

                                return (
                                  <td
                                    key={cellId}
                                    className={`matrix-cell ${
                                      isSpotted ? "spotted-highlight" : ""
                                    } ${isFocused ? "crosshair-active-cell" : ""} ${
                                      isColTrack ? "crosshair-col-track" : ""
                                    } ${!showVal ? "masked-cell" : ""}`}
                                    onMouseEnter={() =>
                                      setHoveredCell({
                                        row: row[0],
                                        col: colNum,
                                        gridId: section.title,
                                      })
                                    }
                                    onMouseLeave={() => setHoveredCell(null)}
                                    onClick={() =>
                                      maskAnswers && toggleReveal(cellId)
                                    }
                                    title={
                                      maskAnswers
                                        ? "Click to reveal"
                                        : `${row[0]} × ${colNum} = ${val}`
                                    }
                                  >
                                    <div className="matrix-cell-content">
                                      <span>{showVal ? val : "?"}</span>
                                      <button
                                        type="button"
                                        className={`cell-star-icon ${starred ? "active" : ""}`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleStar(cellId, {
                                            question: `${row[0]} × ${colNum} = ?`,
                                            answer: String(val),
                                            topicId: "multiplication",
                                          });
                                        }}
                                        title={starred ? "Starred" : "Star"}
                                      >
                                        <IconStar size={11} filled={starred} />
                                      </button>
                                    </div>
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            }

            // Section: High-Yield Series Cards (15s, 16s, 24s/25s)
            if (section.type === "seriesCards") {
              const filteredSeries = normalizedFilter
                ? section.series
                    .map((s) => ({
                      ...s,
                      items: s.items.filter(
                        (item) =>
                          item.exp.toLowerCase().includes(normalizedFilter) ||
                          String(item.val).includes(normalizedFilter),
                      ),
                    }))
                    .filter((s) => s.items.length > 0)
                : section.series;

              if (filteredSeries.length === 0) return null;

              return (
                <div className="learn-section" key={`${section.title}-${secIdx}`}>
                  <div className="section-heading">
                    <h2>{section.title}</h2>
                    <span className="row-badge">High-Yield</span>
                  </div>
                  <div className="series-cards-grid">
                    {filteredSeries.map((s) => (
                      <div className="series-card" key={s.seriesName}>
                        <div className="series-header">{s.seriesName}</div>
                        <div className="series-items-list">
                          {s.items.map((item, i) => {
                            const cellId = `series-${s.seriesName}-${i}`;
                            const showVal = isRevealed(cellId);
                            const starred = isStarred(cellId);

                            return (
                              <div
                                className="series-item-row"
                                key={item.exp}
                                onClick={() =>
                                  maskAnswers && toggleReveal(cellId)
                                }
                              >
                                <span className="series-exp">{item.exp} =</span>
                                <span
                                  className={`series-val highlighted-val ${
                                    !showVal ? "masked-pill" : ""
                                  }`}
                                >
                                  {showVal ? item.val : "?"}
                                </span>
                                <button
                                  type="button"
                                  className={`star-mini-btn ${starred ? "active" : ""}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleStar(cellId, {
                                      question: `${item.exp} = ?`,
                                      answer: String(item.val),
                                      topicId: "multiplication",
                                    });
                                  }}
                                >
                                  <IconStar size={13} filled={starred} />
                                </button>
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
              const filteredRows = normalizedFilter
                ? section.rows.filter((r) =>
                    r.some((c) => String(c).includes(normalizedFilter)),
                  )
                : section.rows;

              if (filteredRows.length === 0) return null;

              return (
                <div className="learn-section" key={`${section.title}-${secIdx}`}>
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
                        {filteredRows.map((r, i) => {
                          const id1 = `sq-${r[0]}`;
                          const id2 = `sq-${r[2]}`;
                          const id3 = `sq-${r[4]}`;
                          return (
                            <tr key={`sq-row-${i}`}>
                              <td className="number-col">{r[0]}</td>
                              <td
                                className={`val-col ${
                                  !isRevealed(id1) ? "masked-cell" : ""
                                }`}
                                onClick={() =>
                                  maskAnswers && toggleReveal(id1)
                                }
                              >
                                {isRevealed(id1) ? r[1] : "?"}
                              </td>

                              <td className="number-col">{r[2]}</td>
                              <td
                                className={`val-col ${
                                  !isRevealed(id2) ? "masked-cell" : ""
                                }`}
                                onClick={() =>
                                  maskAnswers && toggleReveal(id2)
                                }
                              >
                                {isRevealed(id2) ? r[3] : "?"}
                              </td>

                              <td className="number-col highlight-cell">
                                {r[4]}
                              </td>
                              <td
                                className={`val-col highlight-cell highlighted-val ${
                                  !isRevealed(id3) ? "masked-cell" : ""
                                }`}
                                onClick={() =>
                                  maskAnswers && toggleReveal(id3)
                                }
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
              const filteredRows = normalizedFilter
                ? section.rows.filter(([num, cube]) =>
                    String(num).includes(normalizedFilter) ||
                    String(cube).includes(normalizedFilter),
                  )
                : section.rows;

              if (filteredRows.length === 0) return null;

              return (
                <div className="learn-section" key={`${section.title}-${secIdx}`}>
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
                          {filteredRows.slice(0, 8).map(([num, cube]) => {
                            const id = `cube-${num}`;
                            return (
                              <tr key={`cube-${num}`}>
                                <td className="number-col">{num}</td>
                                <td
                                  className={`val-col ${
                                    !isRevealed(id) ? "masked-cell" : ""
                                  }`}
                                  onClick={() =>
                                    maskAnswers && toggleReveal(id)
                                  }
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
                          {filteredRows
                            .slice(8)
                            .map(([num, cube, isHighYield]) => {
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
                                      isHighYield
                                        ? "highlighted-val highlight-cell"
                                        : ""
                                    } ${!isRevealed(id) ? "masked-cell" : ""}`}
                                    onClick={() =>
                                      maskAnswers && toggleReveal(id)
                                    }
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
              const filteredGroups = normalizedFilter
                ? section.groups
                    .map((g) => ({
                      ...g,
                      powers: g.powers.filter(
                        (p) =>
                          p.exp.toLowerCase().includes(normalizedFilter) ||
                          String(p.val).includes(normalizedFilter),
                      ),
                    }))
                    .filter((g) => g.powers.length > 0)
                : section.groups;

              if (filteredGroups.length === 0) return null;

              return (
                <div className="learn-section" key={`${section.title}-${secIdx}`}>
                  <div className="section-heading">
                    <h2>{section.title}</h2>
                    <span className="row-badge">Bases 2, 3, 5</span>
                  </div>
                  <div className="powers-cards-grid">
                    {filteredGroups.map((group) => (
                      <div
                        className="power-group-card"
                        key={`power-${group.base}`}
                      >
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
                                onClick={() =>
                                  maskAnswers && toggleReveal(id)
                                }
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
              const filterItem = ([f, dec, pct, alt]) =>
                !normalizedFilter ||
                f.toLowerCase().includes(normalizedFilter) ||
                dec.toLowerCase().includes(normalizedFilter) ||
                pct.toLowerCase().includes(normalizedFilter) ||
                (alt && alt.toLowerCase().includes(normalizedFilter));

              const col1Filtered = section.col1.filter(filterItem);
              const col2Filtered = section.col2.filter(filterItem);

              if (col1Filtered.length === 0 && col2Filtered.length === 0) return null;

              return (
                <div className="learn-section" key={`${section.title}-${secIdx}`}>
                  <div className="section-heading">
                    <h2>{section.title}</h2>
                    <span className="row-badge">1/1 to 1/20</span>
                  </div>
                  <div className="fractions-two-col-grid">
                    {col1Filtered.length > 0 && (
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
                            {col1Filtered.map(([f, dec, pct, alt]) => {
                              const id = `frac-${f}`;
                              return (
                                <tr key={f}>
                                  <td className="fraction-label">{f}</td>
                                  <td className="decimal-label">{dec}</td>
                                  <td
                                    className={`percentage-label highlighted-val ${
                                      !isRevealed(id) ? "masked-cell" : ""
                                    }`}
                                    onClick={() =>
                                      maskAnswers && toggleReveal(id)
                                    }
                                  >
                                    {isRevealed(id) ? (
                                      <>
                                        <span>{pct}</span>
                                        {alt && (
                                          <span className="alt-pct">
                                            {" "}
                                            ({alt})
                                          </span>
                                        )}
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
                    )}

                    {col2Filtered.length > 0 && (
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
                            {col2Filtered.map(([f, dec, pct, alt]) => {
                              const id = `frac-${f}`;
                              return (
                                <tr key={f}>
                                  <td className="fraction-label">{f}</td>
                                  <td className="decimal-label">{dec}</td>
                                  <td
                                    className={`percentage-label highlighted-val ${
                                      !isRevealed(id) ? "masked-cell" : ""
                                    }`}
                                    onClick={() =>
                                      maskAnswers && toggleReveal(id)
                                    }
                                  >
                                    {isRevealed(id) ? (
                                      <>
                                        <span>{pct}</span>
                                        {alt && (
                                          <span className="alt-pct">
                                            {" "}
                                            ({alt})
                                          </span>
                                        )}
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
                    )}
                  </div>
                </div>
              );
            }

            // Section: High-Yield Fractions
            if (section.type === "highYieldFractions") {
              const filteredRows = normalizedFilter
                ? section.rows.filter(([f, dec, pct, alt]) =>
                    f.toLowerCase().includes(normalizedFilter) ||
                    dec.toLowerCase().includes(normalizedFilter) ||
                    pct.toLowerCase().includes(normalizedFilter) ||
                    (alt && alt.toLowerCase().includes(normalizedFilter)),
                  )
                : section.rows;

              if (filteredRows.length === 0) return null;

              return (
                <div className="learn-section" key={`${section.title}-${secIdx}`}>
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
                        {filteredRows.map(([f, dec, pct, alt]) => {
                          const id = `hyf-${f}`;
                          return (
                            <tr key={f}>
                              <td className="fraction-label bold-fraction">
                                {f}
                              </td>
                              <td
                                className={`percentage-label highlighted-val ${
                                  !isRevealed(id) ? "masked-cell" : ""
                                }`}
                                onClick={() =>
                                  maskAnswers && toggleReveal(id)
                                }
                              >
                                {isRevealed(id) ? (
                                  <>
                                    <strong>{pct}</strong>
                                    {alt && (
                                      <span className="alt-pct"> ({alt})</span>
                                    )}
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
                <div className="learn-section" key={`${section.title}-${secIdx}`}>
                  <div className="section-heading">
                    <h2>{section.title}</h2>
                    <span className="row-badge">Page 6 Blueprint</span>
                  </div>

                  <div className="formula-blueprint-card">
                    <div className="formula-card-top">
                      <span className="formula-card-label">
                        Prime Factorization format:
                      </span>
                      <div className="formula-hero-expression">
                        {data.primeFormat}
                      </div>
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
                          <p className="rule-explanation">
                            {rule.explanation}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="formula-examples-box">
                      <h4 className="examples-header">
                        Worked Blueprint Examples:
                      </h4>
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

            return null;
          })}
        </div>
      )}
    </section>
  );
}
