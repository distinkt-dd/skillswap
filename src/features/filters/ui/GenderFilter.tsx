import React from 'react';
import { Radio } from '@shared/ui';
import styles from './GenderFilter.module.css';

interface GenderFilterProps {
  value: 'male' | 'female' | null;
  onChange: (gender: 'male' | 'female' | null) => void;
}

export const GenderFilter: React.FC<GenderFilterProps> = ({ value, onChange }) => {
  return (
    <div className={styles.genderFilter}>
      <h4>Пол автора</h4>
      <div className={styles.options}>
        <Radio
          name="gender"
          checked={value === null}
          onChange={() => onChange(null)}
          label="Не имеет значения"
        />
        <Radio
          name="gender"
          checked={value === 'male'}
          onChange={() => onChange('male')}
          label="Мужской"
        />
        <Radio
          name="gender"
          checked={value === 'female'}
          onChange={() => onChange('female')}
          label="Женский"
        />
      </div>
    </div>
  );
};
