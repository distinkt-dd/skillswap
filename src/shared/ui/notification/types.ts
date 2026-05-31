import type { ReactNode } from 'react';

export type NotificationType = 'offer' | 'accept' | 'reject' | 'message';

export type NotificationVariant = 'popup' | 'list';

export interface NotificationProps {
  /** Имя пользователя */
  userName: string;
  /** Тип уведомления (определяет текст и иконку) */
  type: NotificationType;
  /** Вариант отображения: popup (всплывающее) или list (в списке) */
  variant?: NotificationVariant;
  /** Статус прочтения (для list режима) */
  isRead?: boolean;
  /** Дата/время уведомления (для list режима) */
  timestamp?: string | Date;
  /** Колбэк на кнопку "Перейти" */
  onAction?: () => void;
  /** Колбэк на закрытие (для popup режима) */
  onClose?: () => void;
  /** Дополнительный CSS-класс */
  className?: string;
  /** Автоматическое скрытие через N мс (только для popup) */
  autoHideDuration?: number;
  /** Кастомная иконка (переопределяет иконку по умолчанию для типа) */
  icon?: ReactNode;
}
