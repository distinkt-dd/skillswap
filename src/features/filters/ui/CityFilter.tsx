import React from 'react';
import { Checkbox, Button, IconUI } from '@shared/ui';
import type { TCity } from '@entities/cities';
import styles from './CityFilter.module.css';

interface CityFilterProps {
  cities: TCity[];
  selectedCityIds: string[];
  showAllCities: boolean;
  onCityToggle: (cityId: string) => void;
  onShowAllClick: () => void;
}

const INITIAL_VISIBLE_CITIES = 5;

export const CityFilter: React.FC<CityFilterProps> = ({
  cities,
  selectedCityIds,
  showAllCities,
  onCityToggle,
  onShowAllClick,
}) => {
  const visibleCities = showAllCities ? cities : cities.slice(0, INITIAL_VISIBLE_CITIES);

  return (
    <div className={styles.cityFilter}>
      <h4>Город</h4>

      <div className={styles.citiesList} style={showAllCities ? { maxHeight: 'none' } : {}}>
        {visibleCities.map((city) => (
          <Checkbox
            key={city.id}
            label={city.name}
            checked={selectedCityIds.includes(city.id)}
            onChange={() => onCityToggle(city.id)}
            className={styles.cityCheckbox}
          />
        ))}
      </div>

      {cities.length > INITIAL_VISIBLE_CITIES && (
        <Button
          variant="tertiary"
          onClick={onShowAllClick}
          icon={<IconUI name={showAllCities ? 'chevronUp' : 'chevronDown'} />}
          iconPosition="right"
          className={styles.showAllButton}
        >
          Все города
        </Button>
      )}
    </div>
  );
};
