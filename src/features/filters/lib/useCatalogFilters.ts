import { useContext } from 'react';
import { CatalogFiltersContext } from './catalogFiltersContext';
import type { CatalogFiltersContextValue } from './catalogFiltersContext';

export const useCatalogFilters = (): CatalogFiltersContextValue => {
  const ctx = useContext(CatalogFiltersContext);
  if (!ctx) {
    throw new Error('useCatalogFilters должен вызываться внутри CatalogFiltersProvider');
  }
  return ctx;
};
