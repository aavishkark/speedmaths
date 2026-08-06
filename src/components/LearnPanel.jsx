import { useState } from "react";

export function LearnPanel({ topic }) {
  const [filterText, setFilterText] = useState("");

  const normalizedFilter = filterText.toLowerCase().trim();

  return (
    <section className="learn-panel" aria-label={`${topic.name} table`}>
      <div className="learn-filter-bar">
        <input
          type="text"
          className="learn-filter-input"
          placeholder="Filter formulas and values (e.g. 15, 1/8, factors)..."
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

      {topic.learnSections.map((section) => {
        const filteredRows = normalizedFilter
          ? section.rows.filter((row) =>
              row.some((cell) => String(cell).toLowerCase().includes(normalizedFilter)),
            )
          : section.rows;

        if (filteredRows.length === 0) {
          return null;
        }

        return (
          <div className="learn-section" key={section.title}>
            <div className="section-heading">
              <h2>{section.title}</h2>
              <span className="row-badge">
                {filteredRows.length} {filteredRows.length === 1 ? "row" : "rows"}
              </span>
            </div>
            <div className={section.dense ? "table-wrap dense" : "table-wrap"}>
              <table>
                <thead>
                  <tr>
                    {section.headers.map((header, index) => (
                      <th key={`${section.title}-head-${index}`}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row, rowIndex) => (
                    <tr key={`${section.title}-row-${rowIndex}`}>
                      {section.headers.map((_, cellIndex) => (
                        <td key={`${section.title}-${rowIndex}-${cellIndex}`}>
                          {row[cellIndex] ?? ""}
                        </td>
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
