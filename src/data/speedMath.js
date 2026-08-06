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

const highYieldMultiplicationFacts = [
  [15, 12, "15s series"],
  [15, 15, "15s series"],
  [15, 18, "15s series"],
  [16, 12, "16s series"],
  [16, 15, "16s series"],
  [16, 16, "16s series"],
  [24, 5, "24s and 25s"],
  [25, 4, "24s and 25s"],
  [25, 8, "24s and 25s"],
].map(([left, right, group]) => makeMultiplicationFact(left, right, group));

const squareFacts = range(1, 30).map((number) => ({
  id: `square-${number}`,
  topicId: "squares",
  group: number <= 10 ? "1 to 10" : number <= 20 ? "11 to 20" : "21 to 30",
  question: `${number}^2 = ?`,
  answer: String(number ** 2),
  acceptedAnswers: [String(number ** 2)],
  reverseQuestion: `${number ** 2} is whose square?`,
  reverseAnswer: String(number),
  reverseAcceptedAnswers: [String(number), `${number}^2`, `${number} square`],
  learnLabel: `${number}^2`,
  learnValue: String(number ** 2),
}));

const cubeFacts = range(1, 15).map((number) => ({
  id: `cube-${number}`,
  topicId: "cubes",
  group: number <= 5 ? "1 to 5" : number <= 10 ? "6 to 10" : "11 to 15",
  question: `${number}^3 = ?`,
  answer: String(number ** 3),
  acceptedAnswers: [String(number ** 3)],
  reverseQuestion: `${number ** 3} is whose cube?`,
  reverseAnswer: String(number),
  reverseAcceptedAnswers: [String(number), `${number}^3`, `${number} cube`],
  learnLabel: `${number}^3`,
  learnValue: String(number ** 3),
}));

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
  })),
);

const fractionRows = [
  ["1 / 1", "1.00", "100%"],
  ["1 / 2", "0.50", "50%"],
  ["1 / 3", "0.333", "33.33%", "33 1/3%"],
  ["1 / 4", "0.25", "25%"],
  ["1 / 5", "0.20", "20%"],
  ["1 / 6", "0.166", "16.66%", "16 2/3%"],
  ["1 / 7", "0.1428", "14.28%", "14 2/7%"],
  ["1 / 8", "0.125", "12.5%", "12 1/2%"],
  ["1 / 9", "0.1111", "11.11%", "11 1/9%"],
  ["1 / 10", "0.10", "10%"],
  ["1 / 11", "0.0909", "9.09%", "9 1/11%"],
  ["1 / 12", "0.0833", "8.33%", "8 1/3%"],
  ["1 / 13", "0.0769", "7.69%", "7 9/13%"],
  ["1 / 14", "0.0714", "7.14%", "7 1/7%"],
  ["1 / 15", "0.0666", "6.66%", "6 2/3%"],
  ["1 / 16", "0.0625", "6.25%", "6 1/4%"],
  ["1 / 17", "0.0588", "5.88%"],
  ["1 / 18", "0.0555", "5.55%", "5 5/9%"],
  ["1 / 19", "0.0526", "5.26%"],
  ["1 / 20", "0.050", "5.00%"],
  ["3 / 8", "0.375", "37.5%"],
  ["5 / 8", "0.625", "62.5%"],
  ["7 / 8", "0.875", "87.5%"],
  ["2 / 7", "0.2856", "28.56%"],
  ["3 / 7", "0.4285", "42.85%"],
  ["5 / 6", "0.8333", "83.33%"],
  ["5 / 12", "0.4166", "41.66%"],
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
    ...(alternate ? [alternate, alternate.replace("%", "")] : []),
  ],
  reverseQuestion: `${percentage} = ?`,
  reverseAnswer: fraction,
  reverseAcceptedAnswers: [fraction, normalizeFraction(fraction)],
  learnLabel: fraction,
  learnValue: percentage,
  detail: decimal,
  alternate,
});

const fractionFacts = fractionRows.map(makeFractionFact);

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
    acceptedAnswers: ["3"],
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
    question: "If N = p^3 x q^2, total factors = ?",
    answer: "12",
    acceptedAnswers: ["12"],
    reverseQuestion: "12 total factors can come from which pattern?",
    reverseAnswer: "p^3 x q^2",
    reverseAcceptedAnswers: ["p^3 x q^2", "p3q2", "p^3q^2"],
    learnLabel: "p^3 x q^2",
    learnValue: "12 total factors",
  },
  {
    id: "factor-example-4-1-2",
    topicId: "factors",
    group: "examples",
    question: "If N = p^4 x q^1 x r^2, total factors = ?",
    answer: "30",
    acceptedAnswers: ["30"],
    reverseQuestion: "30 total factors can come from which pattern?",
    reverseAnswer: "p^4 x q^1 x r^2",
    reverseAcceptedAnswers: ["p^4 x q^1 x r^2", "p4q1r2", "p^4q^1r^2"],
    learnLabel: "p^4 x q^1 x r^2",
    learnValue: "30 total factors",
  },
  {
    id: "factor-example-total-prime",
    topicId: "factors",
    group: "examples",
    question: "If N = 2^3 x 3^2 x 5^1, total prime factors = ?",
    answer: "6",
    acceptedAnswers: ["6"],
    reverseQuestion: "For 2^3 x 3^2 x 5^1, what does 6 count?",
    reverseAnswer: "Total prime factors",
    reverseAcceptedAnswers: ["total prime factors", "prime factors"],
    learnLabel: "2^3 x 3^2 x 5^1",
    learnValue: "6 total prime factors",
  },
  {
    id: "factor-example-distinct",
    topicId: "factors",
    group: "examples",
    question: "If N = 2^3 x 3^2 x 5^1, distinct prime factors = ?",
    answer: "3",
    acceptedAnswers: ["3"],
    reverseQuestion: "For 2^3 x 3^2 x 5^1, what does 3 count?",
    reverseAnswer: "Distinct prime factors",
    reverseAcceptedAnswers: ["distinct prime factors", "different prime factors"],
    learnLabel: "2^3 x 3^2 x 5^1",
    learnValue: "3 distinct prime factors",
  },
  {
    id: "factor-example-total",
    topicId: "factors",
    group: "examples",
    question: "If N = 2^3 x 3^2 x 5^1, total factors = ?",
    answer: "24",
    acceptedAnswers: ["24"],
    reverseQuestion: "For 2^3 x 3^2 x 5^1, what does 24 count?",
    reverseAnswer: "Total factors",
    reverseAcceptedAnswers: ["total factors", "number of factors", "factors"],
    learnLabel: "2^3 x 3^2 x 5^1",
    learnValue: "24 total factors",
  },
];

const multiplicationGridRows = range(11, 20).map((left) => [
  left,
  ...range(1, 10).map((right) => left * right),
]);

const compactRows = (facts, columns = 3) => {
  const rows = [];

  for (let index = 0; index < facts.length; index += columns) {
    rows.push(
      facts
        .slice(index, index + columns)
        .flatMap((fact) => [fact.learnLabel, fact.learnValue]),
    );
  }

  return rows;
};

const topicBase = [
  {
    id: "multiplication",
    name: "Multiplication",
    shortName: "Tables",
    accent: "#e4572e",
    summary: "11 to 20 products plus the CAT high-yield 15s, 16s, 24s, and 25s.",
    facts: [...multiplicationGridFacts, ...highYieldMultiplicationFacts],
    learnSections: [
      {
        title: "11 to 20 Grid",
        headers: ["x", ...range(1, 10)],
        rows: multiplicationGridRows,
        dense: true,
      },
      {
        title: "High-Yield Higher Multiples",
        headers: ["Expression", "Value", "Expression", "Value", "Expression", "Value"],
        rows: compactRows(highYieldMultiplicationFacts, 3),
      },
    ],
  },
  {
    id: "squares",
    name: "Squares",
    shortName: "Squares",
    accent: "#315cfd",
    summary: "Squares from 1^2 to 30^2.",
    facts: squareFacts,
    learnSections: [
      {
        title: "Squares 1 to 30",
        headers: ["x", "x^2", "x", "x^2", "x", "x^2"],
        rows: compactRows(squareFacts, 3),
      },
    ],
  },
  {
    id: "cubes",
    name: "Cubes",
    shortName: "Cubes",
    accent: "#0f8b8d",
    summary: "Cubes from 1^3 to 15^3.",
    facts: cubeFacts,
    learnSections: [
      {
        title: "Cubes 1 to 15",
        headers: ["x", "x^3", "x", "x^3", "x", "x^3"],
        rows: compactRows(cubeFacts, 3),
      },
    ],
  },
  {
    id: "powers",
    name: "Powers",
    shortName: "Powers",
    accent: "#8a5a00",
    summary: "Core powers for bases 2, 3, and 5.",
    facts: powerFacts,
    learnSections: [
      {
        title: "Core Powers",
        headers: ["Power", "Value", "Power", "Value", "Power", "Value"],
        rows: compactRows(powerFacts, 3),
      },
    ],
  },
  {
    id: "fractions",
    name: "Fractions",
    shortName: "Fractions",
    accent: "#6f4bb2",
    summary: "Unit fractions and high-yield fraction-to-percentage recall.",
    facts: fractionFacts,
    learnSections: [
      {
        title: "Fractions to Percentages",
        headers: ["Fraction", "Decimal", "Percentage"],
        rows: fractionRows.map(([fraction, decimal, percentage, alternate]) => [
          fraction,
          decimal,
          alternate ? `${percentage} (${alternate})` : percentage,
        ]),
      },
    ],
  },
  {
    id: "factors",
    name: "Factors",
    shortName: "Factors",
    accent: "#2f6f3e",
    summary: "Prime-factorization formulas and quick examples.",
    facts: factorFacts,
    learnSections: [
      {
        title: "Number System Formulas",
        headers: ["Recall", "Value"],
        rows: factorFacts.map((fact) => [fact.learnLabel, fact.learnValue]),
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
    summary: "All recall facts from the speed-math blueprint.",
    facts: ALL_FACTS,
    learnSections: [
      {
        title: "Mixed Pool",
        headers: ["Topic", "Facts"],
        rows: topicBase.map((topic) => [topic.name, topic.facts.length]),
      },
    ],
  },
];

export const FACTS_BY_TOPIC = Object.fromEntries(
  TOPICS.map((topic) => [topic.id, topic.facts]),
);

export const getFactsForTopic = (topicId) =>
  FACTS_BY_TOPIC[topicId] ?? FACTS_BY_TOPIC.multiplication;
