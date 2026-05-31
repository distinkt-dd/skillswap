import type { Meta, StoryObj, Decorator } from '@storybook/react-vite';
import { Logo } from './logo';
import { BrowserRouter } from 'react-router-dom';

const withCustomBackground: Decorator = (Story) => (
  <BrowserRouter>
    <div
      style={{
        background: 'var(--color-background)',
        padding: '50px',
        borderRadius: '8px',
      }}
    >
      <Story />
    </div>
  </BrowserRouter>
);

const meta: Meta<typeof Logo> = {
  title: 'UI/Logo',
  component: Logo,
  tags: ['autodocs'],
  decorators: [withCustomBackground],
  argTypes: {
    caption: { control: 'text' },
    href: { control: 'text' },
    iconSize: { control: { type: 'range', min: 16, max: 120 } },
    linkType: {
      control: 'radio',
      options: ['a', 'link', 'navlink'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Logo>;

export const Default: Story = {
  args: {
    caption: 'SkillSwap',
    href: '/',
    iconName: 'logo',
    iconSize: 40,
  },
};

export const WithoutLink: Story = {
  args: {
    caption: 'SkillSwap',
    iconName: 'logo',
    iconSize: 40,
  },
};

export const ExternalLink: Story = {
  args: {
    caption: 'SkillSwap',
    href: 'https://example.com',
    iconName: 'logo',
    iconSize: 40,
    linkType: 'a',
  },
};

export const WithNavLink: Story = {
  args: {
    caption: 'SkillSwap',
    href: '/',
    iconName: 'logo',
    iconSize: 40,
    linkType: 'navlink',
  },
};
