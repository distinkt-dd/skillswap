import { useState, useEffect } from 'react';

const STORAGE_KEY = 'skill_swap_favorites_v1';

const loadFavorites = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
};

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>(loadFavorites);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  const isFavorite = (id: string) => favorites.includes(id);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return {
    favorites,
    isFavorite,
    toggleFavorite,
  } as const;
};
