import { createContext } from 'react';
import type { FiltersActions, FiltersState } from './types';

export type CatalogFiltersContextValue = {
  filters: FiltersState;
  actions: FiltersActions;
};

export const CatalogFiltersContext = createContext<CatalogFiltersContextValue | null>(null);
