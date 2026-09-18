/**
 * Assessment-supplied factor ranges and the spreadsheet's reference values.
 * The parent values are reference inputs only; the calculator derives a new,
 * deterministic split for every selected date of birth.
 */
export const LIFE_FACTORS = [
  {
    id: 'genetic-inheritance',
    name: 'Genetic Inheritance',
    min: 9.333,
    max: 10.777,
    referenceMother: 10.233,
    referenceFather: 10.719,
  },
  {
    id: 'constitutional-vitality',
    name: 'Constitutional Vitality',
    min: 8.111,
    max: 9.111,
    referenceMother: 8.198,
    referenceFather: 8.545,
  },
  {
    id: 'mental-patterns',
    name: 'Mental Patterns',
    min: 6.111,
    max: 7.111,
    referenceMother: 6.611,
    referenceFather: 6.588,
  },
  {
    id: 'intellectual-capacity',
    name: 'Intellectual Capacity',
    min: 6.333,
    max: 6.999,
    referenceMother: 6.316,
    referenceFather: 6.443,
  },
  {
    id: 'emotional-foundation',
    name: 'Emotional Foundation',
    min: 7.111,
    max: 7.999,
    referenceMother: 7.382,
    referenceFather: 6.606,
  },
  {
    id: 'spiritual-lineage',
    name: 'Spiritual Lineage',
    min: 5.011,
    max: 6.011,
    referenceMother: 5.109,
    referenceFather: 5.975,
  },
  {
    id: 'soul-connections',
    name: 'Soul Connections',
    min: 5.111,
    max: 6.222,
    referenceMother: 5.113,
    referenceFather: 6.162,
  },
];

export const REFERENCE_TOTAL = LIFE_FACTORS.reduce(
  (sum, factor) => sum + factor.referenceMother + factor.referenceFather,
  0,
);
