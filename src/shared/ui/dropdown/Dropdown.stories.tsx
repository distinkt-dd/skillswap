import type { Meta } from '@storybook/react-vite';
import { Dropdown } from './Dropdown';
import type { DropdownOption } from './Dropdown';
import { useState } from 'react';

const meta = {
  title: 'UI/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Dropdown>;

export default meta;

// Города для тестирования
const cities: DropdownOption[] = [
  { id: 1, name: 'Москва' },
  { id: 2, name: 'Санкт-Петербург' },
  { id: 3, name: 'Новосибирск' },
  { id: 4, name: 'Екатеринбург' },
  { id: 5, name: 'Казань' },
  { id: 6, name: 'Нижний Новгород' },
  { id: 7, name: 'Челябинск' },
  { id: 8, name: 'Красноярск' },
  { id: 9, name: 'Самара' },
  { id: 10, name: 'Уфа' },
];

// Категории для тестирования чекбоксов
const categories: DropdownOption[] = [
  { id: 1, name: 'Бизнес и карьера' },
  { id: 2, name: 'Творчество и искусство' },
  { id: 3, name: 'Иностранные языки' },
  { id: 4, name: 'Здоровье и лайфстайл' },
  { id: 5, name: 'Дом и уют' },
  { id: 6, name: 'Бизнес и карьера' },
  { id: 7, name: 'Творчество и искусство' },
  { id: 8, name: 'Иностранные языки' },
  { id: 9, name: 'Здоровье и лайфстайл' },
  { id: 10, name: 'Дом и уют' },
];

// Базовый вариант с городами
export const Default = () => {
  const [value, setValue] = useState<DropdownOption | null>(null);

  return (
    <div style={{ width: '436px' }}>
      <Dropdown
        options={cities}
        value={value}
        onChange={(option) => setValue(option)}
        label="Город"
        placeholder="Не указан"
        variant="clearable"
        searchable={true}
      />
    </div>
  );
};

// Вариант с чекбоксами
export const WithCheckboxes = () => {
  const [selectedCategories, setSelectedCategories] = useState<DropdownOption[]>([]);

  return (
    <div style={{ width: '436px' }}>
      <Dropdown
        options={categories}
        values={selectedCategories}
        onValuesChange={setSelectedCategories}
        label="Категория навыка"
        placeholder="Выберите категорию"
        variant="clearable"
        mode="multi"
        searchable={true}
      />
    </div>
  );
};
