import { FavoriteButton } from './FavoriteButton';

export default {
  title: 'FavoriteButton',
  component: FavoriteButton,
  args: {
    id: '3',
    isFavorite: false,
  },
  argTypes: {
    id: {
      control: 'text',
    },
    isFavorite: {
      control: 'select',
      options: [true, false],
    },
  },
};

export const Default = {
  args: {
    id: '3',
    isFavorite: false,
  },
};
