import type { Meta, StoryObj, Decorator } from '@storybook/react-vite';
import { Input } from './input';
import { IconUI } from '@shared/ui';
import '../../../app/styles/variables.css';
import { useState } from 'react';

const withCustomBackground: Decorator = (Story) => (
  <div
    style={{
      background: 'var( --color-background)',
      padding: '50px',
      borderRadius: '8px',
    }}
  >
    <Story />
  </div>
);

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  decorators: [withCustomBackground],
  args: {
    width: 527,
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <Input
        type="text"
        label="Имя"
        placeholder="Введите ваш пароль"
        hint={'Пароль должен содержать не менее 8 знаков'}
        rightIcon={<IconUI name="eye" size={24} />}
      />
      <Input
        variant="search"
        placeholder="Искать навык"
        leftIcon={<IconUI name="search" size={24} />}
        showLeftIcon={true}
      />
    </div>
  ),
};

export const DefaultInputError: Story = {
  args: {
    label: 'Имя',
    placeholder: 'Введите ваш пароль',
    value: 'Ошибка',
    error: 'Пароль должен содержать не менее 8 знаков',
    rightIcon: <IconUI name="eye" size={24} />,
    showLeftIcon: true,
    showRightIcon: true,
  },
};

export const SearchWithClearInteractive: Story = {
  render: () => {
    const [value, setValue] = useState('');

    return (
      <Input
        variant="search"
        placeholder="Искать навык"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        leftIcon={<IconUI name="search" size={24} />}
        rightIcon={<IconUI name="cross" size={24} />}
        showLeftIcon={true}
        showRightIcon={value.length > 0}
        onRightIconClick={() => setValue('')}
        width={527}
      />
    );
  },
};

export const IconVisibilityTests: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '527px',
      }}
    >
      <Input
        label="showLeft=true, showRight=true"
        placeholder="Обе иконки видны"
        leftIcon={<IconUI name="user" size={24} />}
        rightIcon={<IconUI name="eye" size={24} />}
        showLeftIcon={true}
        showRightIcon={true}
      />
      <Input
        label="showLeft=true, showRight=false"
        placeholder="Только левая иконка"
        leftIcon={<IconUI name="user" size={24} />}
        rightIcon={<IconUI name="eye" size={24} />}
        showLeftIcon={true}
        showRightIcon={false}
      />
      <Input
        label="showLeft=false, showRight=true"
        placeholder="Только правая иконка"
        leftIcon={<IconUI name="user" size={24} />}
        rightIcon={<IconUI name="eye" size={24} />}
        showLeftIcon={false}
        showRightIcon={true}
      />
      <Input
        label="showLeft=false, showRight=false"
        placeholder="Иконки есть, но скрыты"
        leftIcon={<IconUI name="user" size={24} />}
        rightIcon={<IconUI name="eye" size={24} />}
        showLeftIcon={false}
        showRightIcon={false}
      />
    </div>
  ),
};

export const ConditionalIconVisibility: Story = {
  render: () => {
    const [value1, setValue1] = useState('');
    const [value2, setValue2] = useState('текст');

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          width: '527px',
        }}
      >
        <Input
          label="Показывать крестик если есть текст"
          placeholder="Начните вводить..."
          value={value1}
          onChange={(e) => setValue1(e.target.value)}
          rightIcon={<IconUI name="cross" size={24} />}
          showRightIcon={value1.length > 0}
          onRightIconClick={() => setValue1('')}
        />
        <Input
          label="Уже есть текст - крестик виден"
          placeholder="Начните вводить..."
          value={value2}
          onChange={(e) => setValue2(e.target.value)}
          rightIcon={<IconUI name="cross" size={24} />}
          showRightIcon={value2.length > 0}
          onRightIconClick={() => setValue2('')}
        />
      </div>
    );
  },
};

export const AllTypes: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '527px',
      }}
    >
      <Input type="text" label="Text" placeholder="Обычный текст" />
      <Input
        type="email"
        label="Email"
        placeholder="example@mail.com"
        leftIcon={<IconUI name="user" size={24} />}
        showLeftIcon={true}
      />
      <Input
        type="password"
        label="Password"
        placeholder="********"
        rightIcon={<IconUI name="eye" size={24} />}
        showRightIcon={true}
      />
      <Input type="number" label="Number" placeholder="18" />
      <Input
        type="tel"
        label="Telephone"
        placeholder="+7 (999) 999-99-99"
        leftIcon={<IconUI name="user" size={24} />}
        showLeftIcon={true}
      />
      <Input
        variant="search"
        label="Search"
        placeholder="Поиск..."
        leftIcon={<IconUI name="search" size={24} />}
        showLeftIcon={true}
      />
    </div>
  ),
};
