const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Parses an HTML date input as a local calendar date, avoiding UTC shifts. */
export function parseLocalDate(isoDate) {
  if (typeof isoDate !== 'string') return null;
  const match = isoDate.match(ISO_DATE_PATTERN);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

export function getTodayIsoDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function validateDateOfBirth(isoDate) {
  if (!isoDate) return { valid: false, error: 'Select a date of birth to begin.' };
  const date = parseLocalDate(isoDate);
  if (!date) return { valid: false, error: 'Enter a valid date of birth.' };

  const today = parseLocalDate(getTodayIsoDate());
  if (date > today) {
    return { valid: false, error: 'Date of birth cannot be in the future.' };
  }
  return { valid: true, date };
}

export function formatDateOfBirth(isoDate) {
  const date = parseLocalDate(isoDate);
  if (!date) return '—';
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}
