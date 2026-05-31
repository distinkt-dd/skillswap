import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { CategoriesDropdown } from './CategoriesDropdown';
import '../../../../app/App.css';
import type { CategoryWithSubcategories } from './types';
import dbData from '../../../../shared/api/data/db.json';

const transformCategories = (): CategoryWithSubcategories[] => {
  return dbData.categories.map((cat) => ({
    id: cat.id,
    type: cat.type,
    name: cat.name,
    subcategories: dbData.subcategories
      .filter((sub) => sub.categoryId === cat.id)
      .map((sub) => ({
        id: sub.id,
        name: sub.name,
        categoryId: sub.categoryId,
      })),
  }));
};

const meta: Meta<typeof CategoriesDropdown> = {
  component: CategoriesDropdown,
  title: 'Widgets/Header/CategoriesDropdown',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div
          style={{
            maxWidth: '1136px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '40px',
            padding: '60px',
            background: '#ffffff',
            border: '1px solid #69735d',
            borderRadius: '12px',
            fontFamily: 'Jost, Roboto, sans-serif',
          }}
        >
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof CategoriesDropdown>;

const allCategories = transformCategories();

export const AllCategories: Story = {
  render: function Render() {
    return <CategoriesDropdown categories={allCategories} />;
  },
};
