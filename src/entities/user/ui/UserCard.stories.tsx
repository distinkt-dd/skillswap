import React, { useState } from 'react';
import { UserCard } from './UserCard';
import { FavoriteButton } from '@features/favorites';

export default {
  title: 'Entities/UserCard',
  component: UserCard,
  args: {
    id: 'u1',
    name: 'Виктория',
    avatar: 'https://via.placeholder.com/100',
    location: 'Сочи',
    age: 31,
    canTeach: ['Игра на барабанах'],
    wantsToLearn: ['Тайм менеджмент', 'Медитация', 'Йога', 'Рисование'],
  },
};

export const Catalog = {
  args: {
    detailed: false,
  },
};

export const CatalogWithFavorite = {
  render: (args: React.ComponentProps<typeof UserCard>) => {
    const [active, setActive] = useState(false);
    return (
      <UserCard
        {...args}
        favoriteSlot={
          <FavoriteButton id={args.id} isFavorite={active} onToggle={() => setActive((v) => !v)} />
        }
      />
    );
  },
  args: {
    detailed: false,
  },
};

export const Detailed = {
  args: {
    detailed: true,
    description:
      'Подробное описание: индивидуальные занятия игрой на барабанах для начинающих. Материал подбирается индивидуально, есть домашние задания.',
  },
};
