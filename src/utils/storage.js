const STORAGE_KEYS = {
  dateOfBirth: 'legacy-analytics:last-dob',
  result: 'legacy-analytics:last-result',
  theme: 'legacy-analytics:theme',
};

function safelyParse(value) {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export const storageService = {
  getDateOfBirth() {
    try {
      return window.localStorage.getItem(STORAGE_KEYS.dateOfBirth) || '';
    } catch {
      return '';
    }
  },
  getResult() {
    try {
      return safelyParse(window.localStorage.getItem(STORAGE_KEYS.result));
    } catch {
      return null;
    }
  },
  saveCalculation(dateOfBirth, result) {
    try {
      window.localStorage.setItem(STORAGE_KEYS.dateOfBirth, dateOfBirth);
      window.localStorage.setItem(STORAGE_KEYS.result, JSON.stringify(result));
    } catch {
      // Local persistence is optional; calculation remains available in memory.
    }
  },
  getTheme() {
    try {
      return window.localStorage.getItem(STORAGE_KEYS.theme) || 'dark';
    } catch {
      return 'dark';
    }
  },
  saveTheme(theme) {
    try {
      window.localStorage.setItem(STORAGE_KEYS.theme, theme);
    } catch {
      // Theme persistence should never block UI interaction.
    }
  },
};
