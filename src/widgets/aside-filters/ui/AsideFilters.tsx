import React, { useMemo } from 'react';
import {
  ModeTabs,
  CategoryFilter,
  GenderFilter,
  CityFilter,
  type FiltersState,
  type FiltersActions,
} from '@features/filters';
import { Button, IconUI } from '@shared/ui';
import type { TCategory } from '@entities/categories';
import type { TSubCategory } from '@entities/subcategories';
import type { TCity } from '@entities/cities';
import styles from './AsideFilters.module.css';

interface AsideFiltersProps {
  categories: TCategory[];
  subcategories: TSubCategory[];
  cities: TCity[];
  filters: FiltersState;
  actions: FiltersActions;
}

export const AsideFilters: React.FC<AsideFiltersProps> = ({
  categories,
  subcategories,
  cities,
  filters,
  actions,
}) => {
  // Подсчет количества выбранных значений в фильтрах
  const selectedValuesCount = useMemo(() => {
    let count = 0;
    if (filters.mode !== 'all') count += 1;
    count += filters.cityIds.length;
    count += filters.skillIds.length;
    if (filters.gender !== null) count += 1;
    return count;
  }, [filters.mode, filters.cityIds, filters.skillIds, filters.gender]);

  return (
    <aside className={styles.asideFilters}>
      <div className={styles.header}>
        <h3>
          Фильтры
          {selectedValuesCount > 0 && (
            <span className={styles.filterCount}>({selectedValuesCount})</span>
          )}
        </h3>
        <Button
          variant="tertiary"
          onClick={actions.resetFilters}
          className={styles.resetButton}
          icon={<IconUI name="cross" size={20} />}
          iconPosition="right"
        >
          Сбросить
        </Button>
      </div>

      <ModeTabs value={filters.mode} onChange={actions.setMode} />

      <CategoryFilter
        categories={categories}
        subcategories={subcategories}
        selectedSkillIds={filters.skillIds}
        expandedCategories={filters.expandedCategories}
        onSkillToggle={actions.toggleSkill}
        onCategoryToggle={actions.toggleCategory}
        onShowAllClick={actions.toggleShowAllCategories}
        showAllCategories={filters.showAllCategories}
      />

      <GenderFilter value={filters.gender} onChange={actions.setGender} />

      <CityFilter
        cities={cities}
        selectedCityIds={filters.cityIds}
        showAllCities={filters.showAllCities}
        onCityToggle={actions.toggleCity}
        onShowAllClick={actions.toggleShowAllCities}
      />
    </aside>
  );
};
