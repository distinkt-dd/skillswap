import React from 'react';
import { IconUI, Button } from '@shared/ui';
import styles from './FavoriteButton.module.css';

export type FavoriteButtonProps = {
  id: string;
  isFavorite: boolean;
  onToggle: (id: string) => void;
};

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ id, isFavorite, onToggle }) => (
  <Button
    type="button"
    aria-pressed={isFavorite}
    onClick={() => onToggle(id)}
    className={`${styles.btn} ${isFavorite ? styles.active : ''}`}
    title={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
    variant="tertiary"
    icon={<IconUI name={isFavorite ? 'likeFilled' : 'like'} size={24} />}
  >
    {null}
  </Button>
);
