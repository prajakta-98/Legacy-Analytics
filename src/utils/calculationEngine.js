import { LIFE_FACTORS, REFERENCE_TOTAL } from '../data/lifeFactors';
import { parseLocalDate } from './dateUtils';

const THOUSANDTHS = 1000;
const GRAND_TOTAL_UNITS = 100 * THOUSANDTHS;
const EPSILON = 1e-9;

export function getDominantParent(day) {
  return day % 2 === 1 ? 'Mother' : 'Father';
}

/** A stable, deliberately simple hash for a local ISO date. */
function hashDate(isoDate) {
  let hash = 2166136261;
  for (let index = 0; index < isoDate.length; index += 1) {
    hash ^= isoDate.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededUnit(seed) {
  const mixed = Math.imul(seed ^ (seed >>> 16), 2246822519) >>> 0;
  return mixed / 4294967295;
}

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function toUnits(value) {
  return Math.round(value * THOUSANDTHS);
}

function getSeededFactorValue(factor, referenceKey, seed) {
  const baseline = clamp(factor[referenceKey], factor.min, factor.max);
  const variation = (seededUnit(seed) - 0.5) * (factor.max - factor.min) * 0.36;
  return toUnits(clamp(baseline + variation, factor.min, factor.max));
}

/**
 * Moves an array of integer thousandths to its target total while retaining
 * every supplied factor boundary. The seeded order prevents a fixed factor
 * from always absorbing the rounding remainder.
 */
function normalizeWithinBounds(rawUnits, minimums, maximums, targetUnits, dateHash, salt) {
  const minimumTotal = minimums.reduce((sum, value) => sum + value, 0);
  const maximumTotal = maximums.reduce((sum, value) => sum + value, 0);
  if (targetUnits < minimumTotal || targetUnits > maximumTotal) {
    throw new Error('Parent target is outside the supplied factor ranges.');
  }

  const units = rawUnits.map((value, index) => clamp(value, minimums[index], maximums[index]));
  let remaining = targetUnits - units.reduce((sum, value) => sum + value, 0);
  const order = [...units.keys()].sort((left, right) => {
    const leftRank = seededUnit(dateHash ^ Math.imul(left + salt, 0x85ebca6b));
    const rightRank = seededUnit(dateHash ^ Math.imul(right + salt, 0x85ebca6b));
    return leftRank - rightRank || left - right;
  });

  while (remaining !== 0) {
    let adjusted = false;
    for (const index of order) {
      if (remaining > 0 && units[index] < maximums[index]) {
        units[index] += 1;
        remaining -= 1;
        adjusted = true;
      } else if (remaining < 0 && units[index] > minimums[index]) {
        units[index] -= 1;
        remaining += 1;
        adjusted = true;
      }
      if (remaining === 0) break;
    }
    if (!adjusted) throw new Error('Unable to normalize parental allocation.');
  }
  return units;
}

/**
 * Application implementation of the supplied assessment rules, not an
 * official formula. Reference spreadsheet values are baselines; the full DOB
 * hashes into stable, per-factor variation. The day controls aggregate parent
 * dominance, and integer thousandths guarantee a displayed 100.000 total.
 */
export function calculateLifeFactors(isoDate) {
  const date = parseLocalDate(isoDate);
  if (!date) throw new Error('A valid local ISO date is required.');

  const day = date.getDate();
  const dominantParent = getDominantParent(day);
  const dateHash = hashDate(isoDate);
  const minimums = LIFE_FACTORS.map((factor) => toUnits(factor.min));
  const maximums = LIFE_FACTORS.map((factor) => toUnits(factor.max));
  const rawMother = LIFE_FACTORS.map((factor, index) =>
    getSeededFactorValue(factor, 'referenceMother', dateHash + Math.imul(index + 3, 0x9e3779b9)),
  );
  const rawFather = LIFE_FACTORS.map((factor, index) =>
    getSeededFactorValue(factor, 'referenceFather', dateHash + Math.imul(index + 17, 0x7f4a7c15)),
  );

  // A deterministic 2.2%-5.4% lead stays feasible with all factor boundaries.
  const leadFraction = 0.022 + seededUnit(dateHash ^ 0x5bd1e995) * 0.032;
  const dominantUnits = Math.round((GRAND_TOTAL_UNITS * (1 + leadFraction)) / 2);
  const motherTargetUnits = dominantParent === 'Mother' ? dominantUnits : GRAND_TOTAL_UNITS - dominantUnits;
  const fatherTargetUnits = GRAND_TOTAL_UNITS - motherTargetUnits;
  const motherUnits = normalizeWithinBounds(rawMother, minimums, maximums, motherTargetUnits, dateHash, 31);
  const fatherUnits = normalizeWithinBounds(rawFather, minimums, maximums, fatherTargetUnits, dateHash, 67);

  const factors = LIFE_FACTORS.map((factor, index) => {
    const mother = motherUnits[index] / THOUSANDTHS;
    const father = fatherUnits[index] / THOUSANDTHS;
    const total = (motherUnits[index] + fatherUnits[index]) / THOUSANDTHS;
    return { id: factor.id, name: factor.name, mother, father, total };
  });
  const motherTotal = motherTargetUnits / THOUSANDTHS;
  const fatherTotal = fatherTargetUnits / THOUSANDTHS;
  const result = {
    factors,
    motherTotal,
    fatherTotal,
    grandTotal: GRAND_TOTAL_UNITS / THOUSANDTHS,
    dominantParent,
    difference: Math.abs(motherTotal - fatherTotal),
    referenceTotal: Number(REFERENCE_TOTAL.toFixed(3)),
  };

  if (!validateCalculationResult(result, day)) {
    throw new Error('Generated calculation did not satisfy assessment invariants.');
  }
  return result;
}

export function validateCalculationResult(result, day) {
  if (!result || !Array.isArray(result.factors) || result.factors.length !== LIFE_FACTORS.length) return false;
  if (!Number.isInteger(day) || day < 1 || day > 31) return false;
  if (result.dominantParent !== getDominantParent(day)) return false;
  const values = [result.motherTotal, result.fatherTotal, result.grandTotal, result.difference];
  if (!values.every((value) => Number.isFinite(value) && value >= 0)) return false;
  if (Math.abs(result.motherTotal + result.fatherTotal - 100) > EPSILON) return false;
  if (Math.abs(result.grandTotal - 100) > EPSILON) return false;
  if (result.dominantParent === 'Mother' && result.motherTotal <= result.fatherTotal) return false;
  if (result.dominantParent === 'Father' && result.fatherTotal <= result.motherTotal) return false;

  const summedFactorTotal = result.factors.reduce((sum, factor) => sum + factor.total, 0);
  if (Math.abs(summedFactorTotal - 100) > EPSILON) return false;

  return result.factors.every((factor, index) => {
    const source = LIFE_FACTORS[index];
    const inRange = (value) => value >= source.min - EPSILON && value <= source.max + EPSILON;
    return (
      factor.id === source.id &&
      ['mother', 'father', 'total'].every((key) => Number.isFinite(factor[key]) && factor[key] >= 0) &&
      inRange(factor.mother) &&
      inRange(factor.father) &&
      Math.abs(factor.mother + factor.father - factor.total) <= EPSILON
    );
  });
}
