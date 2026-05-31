import { useEffect, useState } from 'react';
import {
  applyTheme,
  getNextThemeMode,
  getSavedThemeMode,
  getSystemTheme,
  saveThemeMode,
  type ResolvedTheme,
  type ThemeMode,
} from './theme';

export const useTheme = () => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => getSavedThemeMode());
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() => getSystemTheme());

  const resolvedTheme: ResolvedTheme = themeMode === 'system' ? systemTheme : themeMode;

  useEffect(() => {
    applyTheme(resolvedTheme);
    saveThemeMode(themeMode);
  }, [resolvedTheme, themeMode]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      setSystemTheme(getSystemTheme());
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const toggleTheme = () => {
    setThemeMode((currentThemeMode) => getNextThemeMode(currentThemeMode));
  };

  return {
    themeMode,
    resolvedTheme,
    setThemeMode,
    toggleTheme,
  };
};
