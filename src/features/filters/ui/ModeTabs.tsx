import React from 'react';
import { Radio } from '@shared/ui';
import type { FilterMode } from '../lib/types';
import styles from './ModeTabs.module.css';

interface ModeTabsProps {
  value: FilterMode;
  onChange: (mode: FilterMode) => void;
}

export const ModeTabs: React.FC<ModeTabsProps> = ({ value, onChange }) => {
  return (
    <div className={styles.modeTabs}>
      <div className={styles.radioWrapper}>
        <Radio
          name="filterMode"
          checked={value === 'all'}
          onChange={() => onChange('all')}
          label="Всё"
        />
      </div>
      <div className={styles.radioWrapper}>
        <Radio
          name="filterMode"
          checked={value === 'wantToLearn'}
          onChange={() => onChange('wantToLearn')}
          label="Хочу научиться"
        />
      </div>
      <div className={styles.radioWrapper}>
        <Radio
          name="filterMode"
          checked={value === 'canTeach'}
          onChange={() => onChange('canTeach')}
          label="Могу научить"
        />
      </div>
    </div>
  );
};
