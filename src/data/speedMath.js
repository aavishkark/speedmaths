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

const foundationGridRows = range(1, 10).map((left) => [
  left,
  ...range(1, 10).map((right) => left * right),
]);

const multiplicationGridRows = range(11, 20).map((left) => [
  left,
  ...range(1, 10).map((right) => left * right),
]);

const full1to20GridRows = range(1, 20).map((left) => [
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
        gridType: "11-20",
      },
      {
        title: "Foundation 1 to 10 Grid",
        type: "grid",
        headers: ["×", ...range(1, 10)],
        rows: foundationGridRows,
        dense: true,
        gridType: "1-10",
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

export const ALL_LEARN_SECTIONS = topicBase.flatMap((topic) =>
  topic.learnSections.map((section) => ({
    ...section,
    topicId: topic.id,
    topicName: topic.name,
    topicAccent: topic.accent,
    blueprintPage: topic.blueprintPage,
    protocol: topic.protocol,
  })),
);

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
    learnSections: ALL_LEARN_SECTIONS,
  },
];

export const FACTS_BY_TOPIC = Object.fromEntries(
  TOPICS.map((topic) => [topic.id, topic.facts]),
);

export const getFactsForTopic = (topicId) =>
  FACTS_BY_TOPIC[topicId] ?? FACTS_BY_TOPIC.multiplication;

/* ==========================================================================
   FRACTION FAMILIES (Grouped for Visual & Pattern-Based Mastery)
   ========================================================================== */
export const FRACTION_FAMILIES = [
  {
    familyName: "The 7s Cyclic Family",
    tag: "Cyclic Orbit",
    mnemonic: "Notice cyclic sequence: 14 → 28 → 42 → 57 → 71 → 85. Double and step!",
    items: [
      { fraction: "1/7", decimal: "0.1428", percentage: "14.28%", alt: "14 2/7%", val: 14.28 },
      { fraction: "2/7", decimal: "0.2857", percentage: "28.57%", alt: "28 4/7%", val: 28.57 },
      { fraction: "3/7", decimal: "0.4285", percentage: "42.85%", alt: "42 6/7%", val: 42.85 },
      { fraction: "4/7", decimal: "0.5714", percentage: "57.14%", alt: "57 1/7%", val: 57.14 },
      { fraction: "5/7", decimal: "0.7142", percentage: "71.42%", alt: "71 3/7%", val: 71.42 },
      { fraction: "6/7", decimal: "0.8571", percentage: "85.71%", alt: "85 5/7%", val: 85.71 },
    ],
  },
  {
    familyName: "The 8s Step Family",
    tag: "+25% Clean Step",
    mnemonic: "Odd numerators jump in clean +25% steps: 12.5% → 37.5% → 62.5% → 87.5%.",
    items: [
      { fraction: "1/8", decimal: "0.1250", percentage: "12.50%", alt: "12 1/2%", val: 12.5 },
      { fraction: "3/8", decimal: "0.3750", percentage: "37.50%", alt: "37 1/2%", val: 37.5 },
      { fraction: "5/8", decimal: "0.6250", percentage: "62.50%", alt: "62 1/2%", val: 62.5 },
      { fraction: "7/8", decimal: "0.8750", percentage: "87.50%", alt: "87 1/2%", val: 87.5 },
    ],
  },
  {
    familyName: "The 9s & 11s Reciprocal Mirror Family",
    tag: "Mirror Rule",
    mnemonic: "Denominator 9 gives multiples of 11 (11.11%, 22.22%...). Denominator 11 gives multiples of 9 (9.09%, 18.18%...).",
    items: [
      { fraction: "1/9", decimal: "0.1111", percentage: "11.11%", alt: "11 1/9%", val: 11.11 },
      { fraction: "2/9", decimal: "0.2222", percentage: "22.22%", alt: "22 2/9%", val: 22.22 },
      { fraction: "4/9", decimal: "0.4444", percentage: "44.44%", alt: "44 4/9%", val: 44.44 },
      { fraction: "5/9", decimal: "0.5555", percentage: "55.55%", alt: "55 5/9%", val: 55.55 },
      { fraction: "7/9", decimal: "0.7777", percentage: "77.77%", alt: "77 7/9%", val: 77.77 },
      { fraction: "8/9", decimal: "0.8888", percentage: "88.88%", alt: "88 8/9%", val: 88.88 },
      { fraction: "1/11", decimal: "0.0909", percentage: "9.09%", alt: "9 1/11%", val: 9.09 },
      { fraction: "2/11", decimal: "0.1818", percentage: "18.18%", alt: "18 2/11%", val: 18.18 },
      { fraction: "3/11", decimal: "0.2727", percentage: "27.27%", alt: "27 3/11%", val: 27.27 },
      { fraction: "4/11", decimal: "0.3636", percentage: "36.36%", alt: "36 4/11%", val: 36.36 },
      { fraction: "5/11", decimal: "0.4545", percentage: "45.45%", alt: "45 5/11%", val: 45.45 },
      { fraction: "7/11", decimal: "0.6363", percentage: "63.63%", alt: "63 7/11%", val: 63.63 },
      { fraction: "9/11", decimal: "0.8181", percentage: "81.81%", alt: "81 9/11%", val: 81.81 },
    ],
  },
  {
    familyName: "The 6s & 12s Halves Family",
    tag: "Half-Step Rule",
    mnemonic: "1/12 is exactly half of 1/6 (8.33%). 5/12 = 50% - 8.33% = 41.66%, and 7/12 = 50% + 8.33% = 58.33%.",
    items: [
      { fraction: "1/6", decimal: "0.1666", percentage: "16.66%", alt: "16 2/3%", val: 16.66 },
      { fraction: "5/6", decimal: "0.8333", percentage: "83.33%", alt: "83 1/3%", val: 83.33 },
      { fraction: "1/12", decimal: "0.0833", percentage: "8.33%", alt: "8 1/3%", val: 8.33 },
      { fraction: "5/12", decimal: "0.4166", percentage: "41.66%", alt: "41 2/3%", val: 41.66 },
      { fraction: "7/12", decimal: "0.5833", percentage: "58.33%", alt: "58 1/3%", val: 58.33 },
      { fraction: "11/12", decimal: "0.9166", percentage: "91.66%", alt: "91 2/3%", val: 91.66 },
    ],
  },
  {
    familyName: "High-Yield Tough Primes & Sixteenths",
    tag: "CAT Benchmarks",
    mnemonic: "Essential anchor cutoffs for rapid DI percentage comparison.",
    items: [
      { fraction: "1/13", decimal: "0.0769", percentage: "7.69%", alt: "7 9/13%", val: 7.69 },
      { fraction: "1/14", decimal: "0.0714", percentage: "7.14%", alt: "7 1/7%", val: 7.14 },
      { fraction: "1/15", decimal: "0.0666", percentage: "6.66%", alt: "6 2/3%", val: 6.66 },
      { fraction: "1/16", decimal: "0.0625", percentage: "6.25%", alt: "6 1/4%", val: 6.25 },
      { fraction: "3/16", decimal: "0.1875", percentage: "18.75%", alt: "18 3/4%", val: 18.75 },
      { fraction: "5/16", decimal: "0.3125", percentage: "31.25%", alt: "31 1/4%", val: 31.25 },
      { fraction: "1/17", decimal: "0.0588", percentage: "5.88%", alt: "5 15/17%", val: 5.88 },
      { fraction: "1/19", decimal: "0.0526", percentage: "5.26%", alt: "5 5/19%", val: 5.26 },
    ],
  },
];

/* ==========================================================================
   MENTAL MATH SHORTCUTS & MEMORIZATION HACKS
   ========================================================================== */
export const MENTAL_TRICKS = {
  multiplication: [
    {
      title: "11s Multiplication Trick",
      badge: "Instant Mental Math",
      rule: "For any 2-digit number AB × 11, sandwich (A + B) between A and B.",
      example: "43 × 11 → 4 _ (4+3) _ 3 = 473. (If sum ≥ 10, carry 1 to left: 78 × 11 = 858).",
    },
    {
      title: "15s Shortcut (10× + Half)",
      badge: "Fast Decomposition",
      rule: "To multiply by 15: Multiply by 10, then add half of that result.",
      example: "15 × 18 → 180 + 90 = 270. 15 × 24 → 240 + 120 = 360.",
    },
    {
      title: "Teens Multiplication (11-19 × 11-19)",
      badge: "Vedic Anchor",
      rule: "Add the unit digit of 2nd number to 1st number, multiply by 10, then add product of unit digits.",
      example: "14 × 17 → (14 + 7) × 10 + (4 × 7) = 210 + 28 = 238.",
    },
  ],
  squares: [
    {
      title: "Squaring Numbers Ending in 5",
      badge: "Universal Rule",
      rule: "For (N5)², multiply N by (N + 1) and append '25'.",
      example: "35² → (3 × 4) | 25 = 1225. 65² → (6 × 7) | 25 = 4225. 85² → (8 × 9) | 25 = 7225.",
    },
    {
      title: "Base 50 Square Method (41² to 59²)",
      badge: "High-Speed CAT Method",
      rule: "For (50 ± d)², the result is (25 ± d) in first 2 digits, and d² (2 digits) in last 2 digits.",
      example: "47² (d = 3 below 50) → (25 - 3) | 3² = 2209. 54² (d = 4 above 50) → (25 + 4) | 4² = 2916.",
    },
    {
      title: "Symmetry around 25² (625)",
      badge: "Pattern Anchor",
      rule: "(25 - d)² and (25 + d)² share the exact same last two digits!",
      example: "24² = 576 ⟷ 26² = 676 (ends in 76). 21² = 441 ⟷ 29² = 841 (ends in 41).",
    },
  ],
  cubes: [
    {
      title: "Unit Digit Matching Rule",
      badge: "Last Digit Pattern",
      rule: "Most numbers retain their unit digit when cubed: 1³→1, 4³→4, 5³→5, 6³→6, 9³→9, 0³→0. Primes swap: 2↔8 and 3↔7.",
      example: "7³ ends in 3 (343), 8³ ends in 2 (512), 12³ ends in 8 (1728), 13³ ends in 7 (2197).",
    },
    {
      title: "Key CAT Cube Milestones",
      badge: "Memorization Anchors",
      rule: "11³ = 1331 (Pascal's Triangle Row 4), 12³ = 1728 (Hardy-Ramanujan Taxicab base), 15³ = 3375.",
      example: "Used constantly in 3-year Compound Interest questions at 10% (1.1³ = 1.331) and 20% (1.2³ = 1.728).",
    },
  ],
  powers: [
    {
      title: "Power of 2 Milestones",
      badge: "Binary Scale",
      rule: "Anchor at 2⁵ = 32, 2⁷ = 128, 2¹⁰ = 1024 (1 Kilo).",
      example: "2⁸ = 256, 2⁹ = 512, 2¹⁰ = 1024. Knowing 1024 allows fast doubling: 2¹¹ = 2048.",
    },
    {
      title: "Power Bridges (3 and 5)",
      badge: "Log & Index Hack",
      rule: "3⁴ = 81, 3⁵ = 243, 3⁶ = 729 (notice 729 is both 27² and 9³ and 3⁶!). 5⁴ = 625 (25²), 5⁵ = 3125.",
      example: "In CAT logs/indices, seeing 729 instantly substitutes 3⁶ or 9³.",
    },
  ],
  fractions: [
    {
      title: "The 9s vs 11s Reciprocal Rule",
      badge: "Golden CAT Shortcut",
      rule: "Fractions with denominator 9 produce multiples of 11. Fractions with denominator 11 produce multiples of 9.",
      example: "3/9 = 3 × 11.11% = 33.33%. 4/11 = 4 × 9.09% = 36.36%. 7/11 = 7 × 9.09% = 63.63%.",
    },
    {
      title: "The 7s Cyclic Permutation",
      badge: "14-28-42-57-71-85",
      rule: "All 1/7 to 6/7 multiples share the exact sequence of digits: 142857 rotated in order.",
      example: "1/7=14.28%, 2/7=28.57%, 3/7=42.85%, 4/7=57.14%, 5/7=71.42%, 6/7=85.71%.",
    },
  ],
  factors: [
    {
      title: "Factors of a Perfect Square",
      badge: "Odd Factors Rule",
      rule: "A number has an ODD number of total factors if and only if it is a PERFECT SQUARE.",
      example: "36 = 2² × 3² has (2+1)(2+1) = 9 factors (Odd). 12 = 2² × 3¹ has (2+1)(1+1) = 6 factors (Even).",
    },
    {
      title: "Sum & Product of Factors",
      badge: "CAT Advanced Formula",
      rule: "Product of all factors = N^(Total Factors / 2). Sum of factors = [(p^(a+1)-1)/(p-1)] × [(q^(b+1)-1)/(q-1)].",
      example: "For 12 (6 factors), Product = 12^(6/2) = 12³ = 1728. Factors: 1×12, 2×6, 3×4 = 1728.",
    },
  ],
};

/* ==========================================================================
   DYNAMIC PRIME FACTORIZATION & FACTOR CALCULATOR HELPER
   ========================================================================== */
export function calculatePrimeFactors(num) {
  const n = parseInt(num, 10);
  if (!n || n < 2 || n > 100000) {
    return null;
  }

  let temp = n;
  const factors = {};

  for (let d = 2; d * d <= temp; d++) {
    if (temp % d === 0) {
      let count = 0;
      while (temp % d === 0) {
        count++;
        temp = Math.floor(temp / d);
      }
      factors[d] = count;
    }
  }
  if (temp > 1) {
    factors[temp] = (factors[temp] || 0) + 1;
  }

  const primeBases = Object.keys(factors).map(Number);
  const primeFormat = primeBases
    .map((p) => {
      const exp = factors[p];
      const sup = exp === 1 ? "" : String(exp).replace(/\d/g, (d) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[d]);
      return `${p}${sup}`;
    })
    .join(" × ");

  const totalFactorsParts = primeBases.map((p) => factors[p] + 1);
  const totalFactorsCount = totalFactorsParts.reduce((a, b) => a * b, 1);
  const totalFactorsFormula = `${totalFactorsParts.map((x) => `(${x})`).join(" × ")} = ${totalFactorsCount}`;

  const primeExponents = primeBases.map((p) => factors[p]);
  const primeFactorsCount = primeExponents.reduce((a, b) => a + b, 0);
  const primeFactorsFormula = `${primeExponents.join(" + ")} = ${primeFactorsCount}`;

  const distinctPrimesCount = primeBases.length;

  // List all factors
  const allFactors = [];
  for (let i = 1; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      allFactors.push(i);
      if (i * i !== n) {
        allFactors.push(n / i);
      }
    }
  }
  allFactors.sort((a, b) => a - b);
  const sumOfFactors = allFactors.reduce((a, b) => a + b, 0);

  return {
    number: n,
    primeFormat,
    primeBases,
    factorsMap: factors,
    totalFactorsFormula,
    totalFactorsCount,
    primeFactorsFormula,
    primeFactorsCount,
    distinctPrimesCount,
    distinctPrimes: primeBases,
    allFactors,
    sumOfFactors,
    isPerfectSquare: Math.sqrt(n) % 1 === 0,
  };
}

