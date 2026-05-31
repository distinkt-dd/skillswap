import React from 'react';
import { UserCard, type UserCardProps } from '@entities/user';
import { FavoriteButton, useFavorites } from '@features/favorites';

type UserCardWidgetProps = Omit<UserCardProps, 'favoriteSlot'>;

export const UserCardWidget: React.FC<UserCardWidgetProps> = (props) => {
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <UserCard
      {...props}
      favoriteSlot={
        <FavoriteButton id={props.id} isFavorite={isFavorite(props.id)} onToggle={toggleFavorite} />
      }
    />
  );
};
