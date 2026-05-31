export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'theme-mode';

export const getSavedThemeMode = (): ThemeMode => {
  if (typeof window === 'undefined') {
    return 'system';
  }

  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
    return savedTheme;
  }

  return 'system';
};

export const getSystemTheme = (): ResolvedTheme => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const resolveTheme = (themeMode: ThemeMode): ResolvedTheme => {
  return themeMode === 'system' ? getSystemTheme() : themeMode;
};

export const applyTheme = (theme: ResolvedTheme) => {
  if (typeof document === 'undefined') {
    return;
  }

  document.documentElement.dataset.theme = theme;
};

export const saveThemeMode = (themeMode: ThemeMode) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);
};

export const getNextThemeMode = (themeMode: ThemeMode): ThemeMode => {
  if (themeMode === 'light') return 'dark';
  if (themeMode === 'dark') return 'system';
  return 'light';
};
