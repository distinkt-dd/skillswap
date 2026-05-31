import type { Meta, StoryObj, Decorator } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { Header } from './header';
import { useEffect } from 'react';
import '../../../app/App.css';
import type { CategoryWithSubcategories } from './categories/types';
import dbData from '../../../shared/api/data/db.json';
import { Provider } from 'react-redux';
import { store } from '../../../app/store';
import { CatalogFiltersProvider } from '@features/filters';
import { setUser, clearUser } from '@entities/user';
import type { TUser } from '@entities/user';

const withBackground: Decorator = (Story) => (
  <Provider store={store}>
    <MemoryRouter>
      <CatalogFiltersProvider>
        <div
          style={{
            backgroundColor: '#F9FAF7',
            minHeight: '200px',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Story />
        </div>
      </CatalogFiltersProvider>
    </MemoryRouter>
  </Provider>
);

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

const meta: Meta<typeof Header> = {
  component: Header,
  title: 'Widgets/Header',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [withBackground],
};

export default meta;
type Story = StoryObj<typeof Header>;

const allCategories = transformCategories();
const firstUser = dbData.users[0];

const convertToTUser = (user: typeof firstUser): TUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  description: user.description,
  avatar: user.avatar,
  gender: user.gender as 'male' | 'female',
  birthday: user.birthday,
  cityId: user.cityId,
  subcategoriesIds: user.subcategoriesIds,
});

export const LoggedOut: Story = {
  render: () => {
    useEffect(() => {
      store.dispatch(clearUser());
    }, []);

    return (
      <Header isSkillsOpen={false} categories={allCategories} isLoading={false} error={null} />
    );
  },
};

export const LoggedIn: Story = {
  render: () => {
    useEffect(() => {
      store.dispatch(setUser(convertToTUser(firstUser)));
      return () => {
        store.dispatch(clearUser());
      };
    }, []);

    return (
      <Header isSkillsOpen={false} categories={allCategories} isLoading={false} error={null} />
    );
  },
};

export const Pure: Story = {
  render: () => <Header variant="pure" onClose={() => console.log('Close clicked')} />,
};
