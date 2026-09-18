import { useEffect, useState } from 'react';
import { storageService } from '../utils/storage';

export function useTheme() {
  const [theme, setTheme] = useState(() => storageService.getTheme());

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    storageService.saveTheme(theme);
  }, [theme]);

  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  return { theme, toggleTheme };
}
