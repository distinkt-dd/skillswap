import { IconUI, type TSidebarItemUIProps } from '@shared/ui';
import { useState } from 'react';

export type TAsideConfig = {
  items: TSidebarItemUIProps[];
};

export const useAsideConfig = () => {
  const [items] = useState<TSidebarItemUIProps[]>([
    {
      to: '/requests',
      icon: <IconUI name="request" />,
      label: 'Заявки',
    },
    {
      to: '/my-exchanges',
      icon: <IconUI name="messageText" />,
      label: 'Мои обмены',
    },
    {
      to: '/favorites',
      icon: <IconUI name="like" />,
      label: 'Избранное',
    },
    {
      to: '/my-skills',
      icon: <IconUI name="idea" />,
      label: 'Мои предложения',
    },
    {
      to: '/profile',
      icon: <IconUI name="user" />,
      label: 'Личные данные',
    },
  ]);

  return { items };
};
