import { Avatar } from './Avatar';

export default {
  title: 'Avatar',
  component: Avatar,
  args: {
    size: 'medium',
  },
  argTypes: {
    src: {
      control: 'text',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
  },
};

export const Default = {
  args: {
    size: 'medium',
  },
};
