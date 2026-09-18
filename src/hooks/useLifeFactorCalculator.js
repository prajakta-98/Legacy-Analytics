import { useEffect, useState } from 'react';
import { calculateLifeFactors } from '../utils/calculationEngine';
import { validateDateOfBirth } from '../utils/dateUtils';
import { storageService } from '../utils/storage';

export function useLifeFactorCalculator() {
  const [dateOfBirth, setDateOfBirth] = useState(() => storageService.getDateOfBirth());
  const [result, setResult] = useState(null);
  const [dateError, setDateError] = useState('');

  useEffect(() => {
    if (!dateOfBirth) {
      setResult(null);
      setDateError('');
      return;
    }

    const validation = validateDateOfBirth(dateOfBirth);
    if (!validation.valid) {
      setResult(null);
      setDateError(validation.error);
      return;
    }

    try {
      const nextResult = calculateLifeFactors(dateOfBirth);
      setResult(nextResult);
      setDateError('');
      storageService.saveCalculation(dateOfBirth, nextResult);
    } catch {
      setResult(null);
      setDateError('We could not calculate this date. Please enter a valid date.');
    }
  }, [dateOfBirth]);

  return { dateOfBirth, setDateOfBirth, result, dateError };
}
