import { describe, expect, test } from 'vitest';
import { LIFE_FACTORS } from '../data/lifeFactors';
import { calculateLifeFactors, getDominantParent, validateCalculationResult } from './calculationEngine';
import { validateDateOfBirth } from './dateUtils';

describe('Parental Legacy Calculator', () => {
  test('uses Mother dominance for an odd DOB', () => {
    const result = calculateLifeFactors('1994-08-31');
    expect(result.dominantParent).toBe('Mother');
    expect(result.motherTotal).toBeGreaterThan(result.fatherTotal);
  });

  test('uses Father dominance for an even DOB', () => {
    const result = calculateLifeFactors('1994-08-30');
    expect(result.dominantParent).toBe('Father');
    expect(result.fatherTotal).toBeGreaterThan(result.motherTotal);
  });

  test.each(['1990-01-01', '2001-12-02', '1994-08-31', '2000-02-29'])('reconciles every supported date: %s', (date) => {
    const result = calculateLifeFactors(date);
    expect(validateCalculationResult(result, Number(date.slice(-2)))).toBe(true);
    expect(result.grandTotal).toBe(100);
    expect(result.motherTotal + result.fatherTotal).toBe(100);
    for (const [index, factor] of result.factors.entries()) {
      expect(factor.mother + factor.father).toBeCloseTo(factor.total, 10);
      expect(factor.mother).toBeGreaterThanOrEqual(LIFE_FACTORS[index].min);
      expect(factor.mother).toBeLessThanOrEqual(LIFE_FACTORS[index].max);
      expect(factor.father).toBeGreaterThanOrEqual(LIFE_FACTORS[index].min);
      expect(factor.father).toBeLessThanOrEqual(LIFE_FACTORS[index].max);
    }
  });

  test('returns the same result for the same DOB and changes across DOBs', () => {
    expect(calculateLifeFactors('1996-04-15')).toEqual(calculateLifeFactors('1996-04-15'));
    expect(calculateLifeFactors('1996-04-15')).not.toEqual(calculateLifeFactors('1996-04-16'));
  });

  test('exposes the assessment day-rule directly', () => {
    expect(getDominantParent(1)).toBe('Mother');
    expect(getDominantParent(31)).toBe('Mother');
    expect(getDominantParent(2)).toBe('Father');
  });

  test('rejects future dates', () => {
    expect(validateDateOfBirth('2999-01-01').valid).toBe(false);
  });
});
