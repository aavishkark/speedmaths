const range = (start, end) =>
  Array.from({ length: end - start + 1 }, (_, index) => start + index);

const normalizeFraction = (fraction) => fraction.replace(/\s+/g, "");

const makeMultiplicationFact = (left, right, group) => {
  const product = left * right;
  const expression = `${left} x ${right}`;

  return {
    id: `mul-${left}-${right}`,
    topicId: "multiplication",
    group,
    question: `${expression} = ?`,
    answer: String(product),
    acceptedAnswers: [String(product)],
    reverseQuestion: `${product} = ? x ?`,
    reverseAnswer: expression,
    reverseAcceptedAnswers: [
      expression,
      `${right} x ${left}`,
      `${left} * ${right}`,
      `${right} * ${left}`,
      `${left} × ${right}`,
      `${right} × ${left}`,
    ],
    learnLabel: expression,
    learnValue: String(product),
  };
};

const multiplicationGridFacts = range(11, 20).flatMap((left) =>
  range(1, 10).map((right) =>
    makeMultiplicationFact(left, right, "11 to 20 grid"),
  ),
);

export const highYieldMultiplicationSeries = [
  {
    seriesName: "15s Series",
    items: [
      { exp: "15 × 12", val: "180", left: 15, right: 12 },
      { exp: "15 × 15", val: "225", left: 15, right: 15 },
      { exp: "15 × 18", val: "270", left: 15, right: 18 },
    ],
  },
  {
    seriesName: "16s Series",
    items: [
      { exp: "16 × 12", val: "192", left: 16, right: 12 },
      { exp: "16 × 15", val: "240", left: 16, right: 15 },
      { exp: "16 × 16", val: "256", left: 16, right: 16 },
    ],
  },
  {
    seriesName: "24s & 25s Series",
    items: [
      { exp: "24 × 5", val: "120", left: 24, right: 5 },
      { exp: "25 × 4", val: "100", left: 25, right: 4 },
      { exp: "25 × 8", val: "200", left: 25, right: 8 },
    ],
  },
];

const highYieldMultiplicationFacts = highYieldMultiplicationSeries.flatMap((s) =>
  s.items.map((item) => makeMultiplicationFact(item.left, item.right, s.seriesName)),
);

const squareFacts = range(1, 30).map((number) => ({
  id: `square-${number}`,
  topicId: "squares",
  group: number <= 10 ? "1 to 10" : number <= 20 ? "11 to 20" : "21 to 30",
  question: `${number}² = ?`,
  answer: String(number ** 2),
  acceptedAnswers: [String(number ** 2)],
  reverseQuestion: `${number ** 2} is whose square?`,
  reverseAnswer: String(number),
  reverseAcceptedAnswers: [String(number), `${number}^2`, `${number}²`, `${number} square`],
  learnLabel: `${number}²`,
  learnValue: String(number ** 2),
  isHighYield: number >= 21,
}));

const cubeFacts = range(1, 15).map((number) => ({
  id: `cube-${number}`,
  topicId: "cubes",
  group: number <= 5 ? "1 to 5" : number <= 10 ? "6 to 10" : "11 to 15",
  question: `${number}³ = ?`,
  answer: String(number ** 3),
  acceptedAnswers: [String(number ** 3)],
  reverseQuestion: `${number ** 3} is whose cube?`,
  reverseAnswer: String(number),
  reverseAcceptedAnswers: [String(number), `${number}^3`, `${number}³`, `${number} cube`],
  learnLabel: `${number}³`,
  learnValue: String(number ** 3),
  isHighYield: number >= 11,
}));

export const corePowerGroups = [
  {
    base: 2,
    intro: "2¹ ... 2⁴ = 2, 4, 8, 16",
    powers: [
      { exp: "2⁵", val: "32", power: 5 },
      { exp: "2⁶", val: "64", power: 6 },
      { exp: "2⁷", val: "128", power: 7 },
      { exp: "2⁸", val: "256", power: 8 },
      { exp: "2⁹", val: "512", power: 9 },
      { exp: "2¹⁰", val: "1024", power: 10 },
    ],
  },
  {
    base: 3,
    intro: "3¹ ... 3³ = 3, 9, 27",
    powers: [
      { exp: "3⁴", val: "81", power: 4 },
      { exp: "3⁵", val: "243", power: 5 },
      { exp: "3⁶", val: "729", power: 6 },
    ],
  },
  {
    base: 5,
    intro: "5¹ ... 5³ = 5, 25, 125",
    powers: [
      { exp: "5⁴", val: "625", power: 4 },
      { exp: "5⁵", val: "3125", power: 5 },
    ],
  },
];

const powerSets = [
  { base: 2, max: 10 },
  { base: 3, max: 6 },
  { base: 5, max: 5 },
];

const powerFacts = powerSets.flatMap(({ base, max }) =>
  range(1, max).map((power) => ({
    id: `power-${base}-${power}`,
    topicId: "powers",
    group: `${base}s powers`,
    question: `${base}^${power} = ?`,
    answer: String(base ** power),
    acceptedAnswers: [String(base ** power)],
    reverseQuestion: `${base ** power} = ?`,
    reverseAnswer: `${base}^${power}`,
    reverseAcceptedAnswers: [
      `${base}^${power}`,
      `${base} to the ${power}`,
      `${base} power ${power}`,
    ],
    learnLabel: `${base}^${power}`,
    learnValue: String(base ** power),
    isHighYield:
      (base === 2 && power >= 5) ||
      (base === 3 && power >= 4) ||
      (base === 5 && power >= 4),
  })),
);

export const fractionRows = [
  ["1 / 1", "1.00", "100%", null, 1],
  ["1 / 2", "0.50", "50%", null, 2],
  ["1 / 3", "0.333", "33.33%", "33 1/3%", 3],
  ["1 / 4", "0.25", "25%", null, 4],
  ["1 / 5", "0.20", "20%", null, 5],
  ["1 / 6", "0.166", "16.66%", "16 2/3%", 6],
  ["1 / 7", "0.1428", "14.28%", "14 2/7%", 7],
  ["1 / 8", "0.125", "12.5%", "12 1/2%", 8],
  ["1 / 9", "0.1111", "11.11%", "11 1/9%", 9],
  ["1 / 10", "0.10", "10%", null, 10],
  ["1 / 11", "0.0909", "9.09%", "9 1/11%", 11],
  ["1 / 12", "0.0833", "8.33%", "8 1/3%", 12],
  ["1 / 13", "0.0769", "7.69%", "7 9/13%", 13],
  ["1 / 14", "0.0714", "7.14%", "7 1/7%", 14],
  ["1 / 15", "0.0666", "6.66%", "6 2/3%", 15],
  ["1 / 16", "0.0625", "6.25%", "6 1/4%", 16],
  ["1 / 17", "0.0588", "5.88%", null, 17],
  ["1 / 18", "0.0555", "5.55%", "5 5/9%", 18],
  ["1 / 19", "0.0526", "5.26%", null, 19],
  ["1 / 20", "0.050", "5.00%", null, 20],
];

export const highYieldFractionRows = [
  ["3 / 8", "0.375", "37.5%", "37 1/2%"],
  ["5 / 8", "0.625", "62.5%", "62 1/2%"],
  ["7 / 8", "0.875", "87.5%", "87 1/2%"],
  ["2 / 7", "0.2856", "28.56%", "28 4/7%"],
  ["3 / 7", "0.4285", "42.85%", "42 6/7%"],
  ["5 / 6", "0.8333", "83.33%", "83 1/3%"],
  ["5 / 12", "0.4166", "41.66%", "41 2/3%"],
];

const makeFractionFact = ([fraction, decimal, percentage, alternate]) => ({
  id: `fraction-${normalizeFraction(fraction).replace("/", "-")}`,
  topicId: "fractions",
  group: fraction.startsWith("1 /") ? "unit fractions" : "high-yield fractions",
  question: `${fraction} = ?%`,
  answer: percentage,
  acceptedAnswers: [
    percentage,
    percentage.replace("%", ""),
    decimal,
    ...(alternate ? [alternate, alternate.replace("%", "")] : []),
  ],
  reverseQuestion: `${percentage} = ?`,
  reverseAnswer: fraction,
  reverseAcceptedAnswers: [
    fraction,
    normalizeFraction(fraction),
    fraction.replace(/\s+/g, ""),
  ],
  learnLabel: fraction,
  learnValue: percentage,
  detail: decimal,
  alternate,
  isHighYield: true,
});

const fractionFacts = [
  ...fractionRows.map(makeFractionFact),
  ...highYieldFractionRows.map(makeFractionFact),
];

export const numberSystemFormulas = {
  primeFormat: "N = pᵃ × qᵇ × rᶜ",
  note: "(Where p, q, r are distinct prime numbers)",
  rules: [
    {
      name: "Total Factors",
      formula: "(a + 1)(b + 1)(c + 1)",
      explanation: "Add 1 to each prime power exponent and multiply them together.",
    },
    {
      name: "Total Prime Factors",
      formula: "a + b + c",
      explanation: "Sum of all the prime power exponents.",
    },
    {
      name: "Distinct Prime Factors",
      formula: "3 (p, q, and r)",
      explanation: "Count of unique prime bases involved in the factor tree.",
    },
  ],
  examples: [
    {
      expression: "N = p³ × q²",
      totalFactors: "12",
      calculation: "(3 + 1)(2 + 1) = 4 × 3 = 12",
    },
    {
      expression: "N = p⁴ × q¹ × r²",
      totalFactors: "30",
      calculation: "(4 + 1)(1 + 1)(2 + 1) = 5 × 2 × 3 = 30",
    },
    {
      expression: "N = 2³ × 3² × 5¹",
      totalFactors: "24",
      totalPrime: "6",
      distinctPrime: "3",
      calculation: "Total = 4 × 3 × 2 = 24 | Prime = 3 + 2 + 1 = 6 | Distinct = {2, 3, 5} = 3",
    },
  ],
};

const factorFacts = [
  {
    id: "factor-total-formula",
    topicId: "factors",
    group: "formulas",
    question: "Total factors for N = p^a x q^b x r^c",
    answer: "(a + 1)(b + 1)(c + 1)",
    acceptedAnswers: [
      "(a + 1)(b + 1)(c + 1)",
      "(a+1)(b+1)(c+1)",
      "(a + 1) x (b + 1) x (c + 1)",
      "(a+1)*(b+1)*(c+1)",
    ],
    reverseQuestion: "Which count uses (a + 1)(b + 1)(c + 1)?",
    reverseAnswer: "Total factors",
    reverseAcceptedAnswers: ["total factors", "number of factors", "factors"],
    learnLabel: "Total factors",
    learnValue: "(a + 1)(b + 1)(c + 1)",
  },
  {
    id: "factor-total-prime-formula",
    topicId: "factors",
    group: "formulas",
    question: "Total prime factors for N = p^a x q^b x r^c",
    answer: "a + b + c",
    acceptedAnswers: ["a + b + c", "a+b+c"],
    reverseQuestion: "Which count uses a + b + c?",
    reverseAnswer: "Total prime factors",
    reverseAcceptedAnswers: ["total prime factors", "prime factors"],
    learnLabel: "Total prime factors",
    learnValue: "a + b + c",
  },
  {
    id: "factor-distinct-formula",
    topicId: "factors",
    group: "formulas",
    question: "Distinct prime factors for N = p^a x q^b x r^c",
    answer: "3",
    acceptedAnswers: ["3", "3 (p, q, r)", "p, q, and r"],
    reverseQuestion: "Which count asks how many different primes divide N?",
    reverseAnswer: "Distinct prime factors",
    reverseAcceptedAnswers: ["distinct prime factors", "different prime factors"],
    learnLabel: "Distinct prime factors",
    learnValue: "3",
  },
  {
    id: "factor-example-3-2",
    topicId: "factors",
    group: "examples",
    question: "If N = p³ × q², total factors = ?",
    answer: "12",
    acceptedAnswers: ["12"],
    reverseQuestion: "12 total factors can come from which pattern?",
    reverseAnswer: "p^3 x q^2",
    reverseAcceptedAnswers: ["p^3 x q^2", "p3q2", "p^3q^2", "p³ × q²", "p³ x q²"],
    learnLabel: "p³ × q²",
    learnValue: "12 total factors",
  },
  {
    id: "factor-example-4-1-2",
    topicId: "factors",
    group: "examples",
    question: "If N = p⁴ × q¹ × r², total factors = ?",
    answer: "30",
    acceptedAnswers: ["30"],
    reverseQuestion: "30 total factors can come from which pattern?",
    reverseAnswer: "p^4 x q^1 x r^2",
    reverseAcceptedAnswers: ["p^4 x q^1 x r^2", "p4q1r2", "p^4q^1r^2", "p⁴ × q¹ × r²"],
    learnLabel: "p⁴ × q¹ × r²",
    learnValue: "30 total factors",
  },
  {
    id: "factor-example-total-prime",
    topicId: "factors",
    group: "examples",
    question: "If N = 2³ × 3² × 5¹, total prime factors = ?",
    answer: "6",
    acceptedAnswers: ["6"],
    reverseQuestion: "For 2³ × 3² × 5¹, what does 6 count?",
    reverseAnswer: "Total prime factors",
    reverseAcceptedAnswers: ["total prime factors", "prime factors"],
    learnLabel: "2³ × 3² × 5¹",
    learnValue: "6 total prime factors",
  },
  {
    id: "factor-example-distinct",
    topicId: "factors",
    group: "examples",
    question: "If N = 2³ × 3² × 5¹, distinct prime factors = ?",
    answer: "3",
    acceptedAnswers: ["3"],
    reverseQuestion: "For 2³ × 3² × 5¹, what does 3 count?",
    reverseAnswer: "Distinct prime factors",
    reverseAcceptedAnswers: ["distinct prime factors", "different prime factors"],
    learnLabel: "2³ × 3² × 5¹",
    learnValue: "3 distinct prime factors",
  },
  {
    id: "factor-example-total",
    topicId: "factors",
    group: "examples",
    question: "If N = 2³ × 3² × 5¹, total factors = ?",
    answer: "24",
    acceptedAnswers: ["24"],
    reverseQuestion: "For 2³ × 3² × 5¹, what does 24 count?",
    reverseAnswer: "Total factors",
    reverseAcceptedAnswers: ["total factors", "number of factors", "factors"],
    learnLabel: "2³ × 3² × 5¹",
    learnValue: "24 total factors",
  },
];

const multiplicationGridRows = range(11, 20).map((left) => [
  left,
  ...range(1, 10).map((right) => left * right),
]);

// Helper for squares 3-column layout (1-10, 11-20, 21-30)
const squaresGridRows = range(1, 10).map((i) => [
  i,
  i ** 2,
  i + 10,
  (i + 10) ** 2,
  i + 20,
  (i + 20) ** 2,
]);

// Helper for cubes
const cubesRows = range(1, 15).map((num) => [num, num ** 3, num >= 11]);

const topicBase = [
  {
    id: "multiplication",
    name: "Multiplication",
    shortName: "Tables",
    accent: "#e4572e",
    blueprintPage: "Page 1: Multiplication",
    protocol:
      "Do not read these row by row. Pick random cells and train your brain for instant recognition (e.g., seeing 136 should instantly trigger 17 × 8).",
    summary: "11 to 20 products plus the CAT high-yield 15s, 16s, 24s, and 25s.",
    facts: [...multiplicationGridFacts, ...highYieldMultiplicationFacts],
    learnSections: [
      {
        title: "1. The 11 to 20 Grid",
        type: "grid",
        headers: ["×", ...range(1, 10)],
        rows: multiplicationGridRows,
        dense: true,
      },
      {
        title: "2. High-Yield Higher Multiples",
        type: "seriesCards",
        series: highYieldMultiplicationSeries,
      },
    ],
  },
  {
    id: "squares",
    name: "Squares",
    shortName: "Squares",
    accent: "#315cfd",
    blueprintPage: "Page 2: Exponents & Powers",
    protocol:
      "Squares 1-10 are foundational, 11-20 are core, and 21-30 are critical high-yield targets tested frequently in CAT geometry and algebra.",
    summary: "Squares from 1² to 30².",
    facts: squareFacts,
    learnSections: [
      {
        title: "3. Squares (1 to 30)",
        type: "squaresGrid",
        headers: ["x", "x²", "x", "x²", "x", "x²"],
        rows: squaresGridRows,
      },
    ],
  },
  {
    id: "cubes",
    name: "Cubes",
    shortName: "Cubes",
    accent: "#0f8b8d",
    blueprintPage: "Page 2: Exponents & Powers",
    protocol:
      "Cubes 1 to 10 form the foundation. Memorize 11³ (1331) to 15³ (3375) for fast compound interest, percentages, and volume calculations.",
    summary: "Cubes from 1³ to 15³.",
    facts: cubeFacts,
    learnSections: [
      {
        title: "4. Cubes (1 to 15)",
        type: "cubesList",
        headers: ["x", "x³"],
        rows: cubesRows,
      },
    ],
  },
  {
    id: "powers",
    name: "Powers",
    shortName: "Powers",
    accent: "#8a5a00",
    blueprintPage: "Page 2: Exponents & Powers",
    protocol:
      "Powers of 2 up to 2¹⁰ (1024), powers of 3 up to 3⁶ (729), and powers of 5 up to 5⁵ (3125) are essential for geometric progressions & logarithms.",
    summary: "Core powers for bases 2, 3, and 5.",
    facts: powerFacts,
    learnSections: [
      {
        title: "5. Core Powers (2, 3, 5)",
        type: "powerGroups",
        groups: corePowerGroups,
      },
    ],
  },
  {
    id: "fractions",
    name: "Fractions",
    shortName: "Fractions",
    accent: "#6f4bb2",
    blueprintPage: "Page 3: Fractions & Factors",
    protocol:
      "Master both decimal and exact mixed percentage formats (e.g. 1/7 = 14.28% / 14 2/7%). Notice recurring family patterns like 1/7, 2/7, 3/7 and 1/8, 3/8, 5/8, 7/8.",
    summary: "Unit fractions and high-yield fraction-to-percentage recall.",
    facts: fractionFacts,
    learnSections: [
      {
        title: "6. Fraction to Percentage (1/1 to 1/20)",
        type: "fractionTwoCol",
        col1: fractionRows.slice(0, 10),
        col2: fractionRows.slice(10, 20),
      },
      {
        title: "7. High-Yield Multiples",
        type: "highYieldFractions",
        headers: ["Fraction", "Percentage", "Decimal"],
        rows: highYieldFractionRows,
      },
    ],
  },
  {
    id: "factors",
    name: "Factors",
    shortName: "Factors",
    accent: "#2f6f3e",
    blueprintPage: "Page 3: Fractions & Factors",
    protocol:
      "Prime factorization format N = pᵃ × qᵇ × rᶜ: Total factors = (a+1)(b+1)(c+1), Prime factors = a+b+c, Distinct prime factors = 3 (p, q, r).",
    summary: "Prime-factorization formulas and quick examples.",
    facts: factorFacts,
    learnSections: [
      {
        title: "8. Number System Formulas",
        type: "formulaCard",
        data: numberSystemFormulas,
      },
    ],
  },
];

export const ALL_FACTS = topicBase.flatMap((topic) => topic.facts);

export const TOPICS = [
  ...topicBase,
  {
    id: "mixed",
    name: "Mixed",
    shortName: "Mixed",
    accent: "#1f2937",
    blueprintPage: "Complete CAT Speed Math Blueprint",
    protocol:
      "Mixed drills randomly select across all 6 blueprint modules. Train daily to achieve subconscious recall under time pressure.",
    summary: "All recall facts from the speed-math blueprint.",
    facts: ALL_FACTS,
    learnSections: [
      {
        title: "Complete Blueprint Pool",
        type: "mixedSummary",
        rows: topicBase.map((topic) => [
          topic.name,
          topic.blueprintPage,
          `${topic.facts.length} facts`,
        ]),
      },
    ],
  },
];

export const FACTS_BY_TOPIC = Object.fromEntries(
  TOPICS.map((topic) => [topic.id, topic.facts]),
);

export const getFactsForTopic = (topicId) =>
  FACTS_BY_TOPIC[topicId] ?? FACTS_BY_TOPIC.multiplication;
