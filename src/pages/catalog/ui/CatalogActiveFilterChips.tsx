import type { FC } from 'react';
import { useMemo } from 'react';
import type { FiltersActions, FiltersState } from '@features/filters';
import type { TSubCategory } from '@entities/subcategories';
import type { TCity } from '@entities/cities';
import { Button, IconUI } from '@shared/index';
import styles from './Catalog.module.css';

type CatalogActiveFilterChipsProps = {
  filters: FiltersState;
  cities: TCity[];
  subcategories: TSubCategory[];
  actions: FiltersActions;
};

type ActiveChip = {
  key: string;
  label: string;
  onRemove: () => void;
};

const buildChips = (
  filters: FiltersState,
  cities: TCity[],
  subcategories: TSubCategory[],
  actions: FiltersActions
): ActiveChip[] => {
  const chips: ActiveChip[] = [];

  if (filters.mode === 'wantToLearn') {
    chips.push({
      key: 'mode-want',
      label: 'Хочу научиться',
      onRemove: () => actions.setMode('all'),
    });
  } else if (filters.mode === 'canTeach') {
    chips.push({
      key: 'mode-teach',
      label: 'Могу научить',
      onRemove: () => actions.setMode('all'),
    });
  }

  if (filters.gender === 'male') {
    chips.push({
      key: 'gender-male',
      label: 'Мужской',
      onRemove: () => actions.setGender(null),
    });
  } else if (filters.gender === 'female') {
    chips.push({
      key: 'gender-female',
      label: 'Женский',
      onRemove: () => actions.setGender(null),
    });
  }

  const trimmedSearch = filters.searchQuery.trim();
  if (trimmedSearch) {
    chips.push({
      key: 'search-query',
      label: `Поиск: ${trimmedSearch}`,
      onRemove: () => actions.setSearchQuery(''),
    });
  }

  for (const cityId of filters.cityIds) {
    const city = cities.find((c) => c.id === cityId);
    chips.push({
      key: `city-${cityId}`,
      label: city?.name ?? `Город ${cityId}`,
      onRemove: () => actions.toggleCity(cityId),
    });
  }

  for (const skillId of filters.skillIds) {
    const sub = subcategories.find((s) => s.id === skillId);
    chips.push({
      key: `skill-${skillId}`,
      label: sub?.name ?? skillId,
      onRemove: () => actions.toggleSkill(skillId),
    });
  }

  return chips;
};

export const CatalogActiveFilterChips: FC<CatalogActiveFilterChipsProps> = ({
  filters,
  cities,
  subcategories,
  actions,
}) => {
  const chips = useMemo(
    () => buildChips(filters, cities, subcategories, actions),
    [filters, cities, subcategories, actions]
  );

  if (chips.length === 0) {
    return null;
  }

  return (
    <div className={styles.activeFiltersBlock} role="list" aria-label="Выбранные фильтры">
      <ul className={styles.activeFiltersList}>
        {chips.map((chip) => (
          <li key={chip.key} className={styles.filterChipItem} role="listitem">
            <Button
              type="button"
              variant="tertiary"
              icon={<IconUI name="cross" size={20} />}
              iconPosition="right"
              onClick={chip.onRemove}
              className={styles.filterIconOnlyButton}
            >
              <span className={styles.visuallyHidden}>{chip.label}</span>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};
