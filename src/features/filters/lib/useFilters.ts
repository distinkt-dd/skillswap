import { useEffect, useMemo, useCallback, useState } from 'react';
import type { FilterMode, FiltersState, FiltersActions } from './types';
import { initialFiltersState } from './types';

const FILTERS_STORAGE_KEY = 'catalog-filters';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const readStoredFilters = (): FiltersState => {
  try {
    const raw = window.localStorage.getItem(FILTERS_STORAGE_KEY);
    if (!raw) return initialFiltersState;

    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return initialFiltersState;

    const mode: FiltersState['mode'] =
      parsed.mode === 'all' || parsed.mode === 'wantToLearn' || parsed.mode === 'canTeach'
        ? parsed.mode
        : initialFiltersState.mode;

    const gender: FiltersState['gender'] =
      parsed.gender === 'male' || parsed.gender === 'female' || parsed.gender === null
        ? parsed.gender
        : initialFiltersState.gender;

    const cityIds = Array.isArray(parsed.cityIds)
      ? parsed.cityIds.filter((x): x is string => typeof x === 'string')
      : initialFiltersState.cityIds;

    const skillIds = Array.isArray(parsed.skillIds)
      ? parsed.skillIds.filter((x): x is string => typeof x === 'string')
      : initialFiltersState.skillIds;

    const searchQuery = typeof parsed.searchQuery === 'string' ? parsed.searchQuery : '';

    const expandedCategories = Array.isArray(parsed.expandedCategories)
      ? parsed.expandedCategories.filter((x): x is string => typeof x === 'string')
      : initialFiltersState.expandedCategories;

    const showAllCategories =
      typeof parsed.showAllCategories === 'boolean'
        ? parsed.showAllCategories
        : initialFiltersState.showAllCategories;

    const showAllCities =
      typeof parsed.showAllCities === 'boolean'
        ? parsed.showAllCities
        : initialFiltersState.showAllCities;

    return {
      ...initialFiltersState,
      mode,
      gender,
      cityIds,
      skillIds,
      searchQuery,
      expandedCategories,
      showAllCategories,
      showAllCities,
    };
  } catch {
    return initialFiltersState;
  }
};

const writeStoredFilters = (filters: FiltersState) => {
  try {
    window.localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));
  } catch {
    // ignore storage errors
  }
};

export const useFilters = (): [FiltersState, FiltersActions] => {
  const [filters, setFilters] = useState<FiltersState>(() => readStoredFilters());

  useEffect(() => {
    writeStoredFilters(filters);
  }, [filters]);

  const setMode = useCallback((mode: FilterMode) => {
    setFilters((prev) => ({ ...prev, mode }));
  }, []);

  const setGender = useCallback((gender: 'male' | 'female' | null) => {
    setFilters((prev) => ({ ...prev, gender }));
  }, []);

  const toggleCity = useCallback((cityId: string) => {
    setFilters((prev) => ({
      ...prev,
      cityIds: prev.cityIds.includes(cityId)
        ? prev.cityIds.filter((id) => id !== cityId)
        : [...prev.cityIds, cityId],
    }));
  }, []);

  const toggleSkill = useCallback((skillId: string) => {
    setFilters((prev) => ({
      ...prev,
      skillIds: prev.skillIds.includes(skillId)
        ? prev.skillIds.filter((id) => id !== skillId)
        : [...prev.skillIds, skillId],
    }));
  }, []);

  const setSkillIds = useCallback((skillIds: string[]) => {
    setFilters((prev) => ({ ...prev, skillIds }));
  }, []);

  const toggleCategory = useCallback((categoryId: string) => {
    setFilters((prev) => ({
      ...prev,
      expandedCategories: prev.expandedCategories.includes(categoryId)
        ? prev.expandedCategories.filter((id) => id !== categoryId)
        : [...prev.expandedCategories, categoryId],
    }));
  }, []);

  // Обновляем метод для кнопки "Все категории"
  const toggleShowAllCategories = useCallback(() => {
    setFilters((prev) => {
      const newShowAllCategories = !prev.showAllCategories;

      // Здесь мы не можем получить categories, поэтому просто меняем флаг
      // А сам компонент CategoryFilter будет решать, что показывать
      return {
        ...prev,
        showAllCategories: newShowAllCategories,
        // Не меняем expandedCategories здесь, это сделает компонент
      };
    });
  }, []);

  const toggleShowAllCities = useCallback(() => {
    setFilters((prev) => ({ ...prev, showAllCities: !prev.showAllCities }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFiltersState);
  }, []);

  const actions = useMemo<FiltersActions>(
    () => ({
      setMode,
      setGender,
      toggleCity,
      toggleSkill,
      setSkillIds,
      toggleCategory,
      toggleShowAllCategories,
      toggleShowAllCities,
      setSearchQuery,
      resetFilters,
    }),
    [
      setMode,
      setGender,
      toggleCity,
      toggleSkill,
      setSkillIds,
      toggleCategory,
      toggleShowAllCategories,
      toggleShowAllCities,
      setSearchQuery,
      resetFilters,
    ]
  );

  return [filters, actions];
};
