import type { FiltersState } from '@features/filters';

export const isDefaultCatalogFilters = (filters: FiltersState): boolean =>
  filters.mode === 'all' &&
  filters.gender === null &&
  filters.cityIds.length === 0 &&
  filters.skillIds.length === 0 &&
  filters.searchQuery.trim() === '';
