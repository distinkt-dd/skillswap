import { Button } from './button';
import { IconUI } from '../icons';

export default {
  title: 'Button',
  component: Button,
  subcomponents: { IconUI },
  args: {
    variant: 'primary',
    children: 'Подробнее',
    type: 'button',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
    },
    children: {
      control: 'text',
    },
    icon: {
      control: 'select',
      options: ['count', 'arrowLeft', 'cross', 'clock', 'eyeSlash'],
      mapping: {
        count: <IconUI name="count" />,
        arrowLeft: <IconUI name="arrowLeft" />,
        cross: <IconUI name="cross" />,
        clock: <IconUI name="clock" />,
        eyeSlash: <IconUI name="eyeSlash" className="animate-spin" />,
      },
    },
    iconPosition: {
      control: 'select',
      option: ['left', 'right'],
    },
    width: {
      control: 'text',
    },
    href: {
      control: 'text',
    },
    className: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
    type: {
      control: ['button', 'submit', 'reset'],
    },
  },
};

export const Default = {
  args: {
    variant: 'primary',
    children: 'Подробнее',
  },
};
