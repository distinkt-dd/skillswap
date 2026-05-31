import type { Meta, StoryObj } from '@storybook/react-vite';
import { Notification } from './notification';

const meta: Meta<typeof Notification> = {
  title: 'UI/Notification',
  component: Notification,
  argTypes: {
    type: {
      control: 'select',
      options: ['offer', 'accept', 'reject', 'message'],
      description: 'Тип уведомления',
    },
    variant: {
      control: 'radio',
      options: ['popup', 'list'],
      description: 'Вариант отображения',
    },
    isRead: {
      control: 'boolean',
      description: 'Прочитано ли уведомление (для list режима)',
    },
    userName: {
      control: 'text',
      description: 'Имя пользователя',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Notification>;

export const PopupOffer: Story = {
  args: {
    userName: 'Олег',
    type: 'offer',
    variant: 'popup',
    onClose: () => alert('Закрыто'),
    onAction: () => alert('Переход по действию'),
  },
};

export const PopupAccept: Story = {
  args: {
    userName: 'Николай',
    type: 'accept',
    variant: 'popup',
    onClose: () => alert('Закрыто'),
    onAction: () => alert('Переход по действию'),
  },
};

export const ListOfferUnread: Story = {
  args: {
    userName: 'Олег',
    type: 'offer',
    variant: 'list',
    isRead: false,
    timestamp: 'сегодня',
    onAction: () => alert('Переход по действию'),
  },
};

export const ListAcceptRead: Story = {
  args: {
    userName: 'Николай',
    type: 'accept',
    variant: 'list',
    isRead: true,
    timestamp: 'вчера',
    onAction: () => alert('Переход по действию'),
  },
};

export const ListReject: Story = {
  args: {
    userName: 'Игорь',
    type: 'reject',
    variant: 'list',
    isRead: false,
    timestamp: '13 марта',
    onAction: () => alert('Переход по действию'),
  },
};
