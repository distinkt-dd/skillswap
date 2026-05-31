import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Calendar } from './calendar';
import '../../../app/styles/variables.css';

const meta: Meta<typeof Calendar> = {
  title: 'UI/Calendar',
  component: Calendar,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<Date | null>(new Date(2000, 3, 27));

    return <Calendar label="Дата рождения" value={value} onChange={setValue} width={320} />;
  },
};

export const Empty: Story = {
  render: () => {
    const [value, setValue] = useState<Date | null>(null);

    return (
      <Calendar
        label="Дата рождения"
        value={value}
        onChange={setValue}
        width={320}
        placeholder="дд.мм.гггг"
      />
    );
  },
};
