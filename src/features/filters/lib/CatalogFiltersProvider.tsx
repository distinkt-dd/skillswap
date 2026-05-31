import type { ReactNode } from 'react';
import { useFilters } from './useFilters';
import { CatalogFiltersContext } from './catalogFiltersContext';

export const CatalogFiltersProvider = ({ children }: { children: ReactNode }) => {
  const [filters, actions] = useFilters();

  return (
    <CatalogFiltersContext.Provider value={{ filters, actions }}>
      {children}
    </CatalogFiltersContext.Provider>
  );
};
