import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';

import { SidebarItem } from './sidebar-item';

const IconMail = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="5" width="18" height="14" rx="3" stroke="#1a1a1a" strokeWidth="1.5" />
    <path d="M3 9l9 5 9-5" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const IconPerson = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" stroke="#1a1a1a" strokeWidth="1.5" />
    <path
      d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
      stroke="#1a1a1a"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const meta: Meta<typeof SidebarItem> = {
  title: 'shared/ui/SidebarItem',
  component: SidebarItem,
  decorators: [
    (Story, context) => (
      <MemoryRouter initialEntries={[context.parameters.currentPath ?? '/other']}>
        <div style={{ width: 240, padding: 16 }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SidebarItem>;

export const Default: Story = {
  args: {
    to: '/applications',
    icon: <IconMail />,
    label: 'Заявки',
  },
};

export const Active: Story = {
  args: {
    to: '/applications',
    icon: <IconMail />,
    label: 'Заявки',
  },
  parameters: {
    currentPath: '/applications',
  },
};

export const SidebarList: Story = {
  render: () => (
    <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <SidebarItem to="/applications" icon={<IconMail />} label="Заявки" />
      <SidebarItem to="/profile" icon={<IconPerson />} label="Профиль" />
    </nav>
  ),
  parameters: {
    currentPath: '/applications',
  },
};
