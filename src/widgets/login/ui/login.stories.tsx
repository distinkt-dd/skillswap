import type { Meta, StoryObj } from '@storybook/react-vite';
import { LoginForm } from './login';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// Создаем базовый store
const createBaseStore = (customState = {}) => {
  return configureStore({
    reducer: {
      user: (
        state = {
          error: null,
          isResponse: false,
          ...customState,
        }
      ) => state,
    },
  });
};

const defaultStore = createBaseStore();

const errorStore = createBaseStore({
  error: 'Email или пароль введён неверно. Пожалуйста проверьте правильность введённых данных',
});

const loadingStore = createBaseStore({ isResponse: true });

const meta = {
  title: 'Widgets/LoginForm',
  component: LoginForm,
  decorators: [
    (Story, context) => {
      const store = context.parameters.store || defaultStore;

      return (
        <Provider store={store}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '100vh',
              padding: '20px',
              background: '#f5f5f5',
            }}
          >
            <Story />
          </div>
        </Provider>
      );
    },
  ],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

// Обычная форма
export const Default: Story = {};

// Форма с ошибкой
export const WithError: Story = {
  parameters: {
    store: errorStore,
  },
};

// Форма в состоянии загрузки
export const Loading: Story = {
  parameters: {
    store: loadingStore,
  },
};
