import React, { useState, useEffect } from 'react';
import styles from './notification.module.css';
import type { NotificationProps } from './types';
import { Button } from '../button';
import { IconUI } from '../icons';

//  IconUI
const getIconByType = (type: NotificationProps['type']) => {
  // при необходимости можно картинки поменять в зависимости от типа оповещения
  switch (type) {
    case 'offer':
      return <IconUI name="idea" size={24} />;
    case 'accept':
      return <IconUI name="idea" size={24} />;
    case 'reject':
      return <IconUI name="cross" size={24} />;
    default:
      return <IconUI name="idea" size={24} />;
  }
};

const getMessageByType = (type: NotificationProps['type'], userName: string) => {
  switch (type) {
    case 'offer':
      return `${userName} предлагает вам обмен`;
    case 'accept':
      return `${userName} принял ваш обмен`;
    case 'reject':
      return `${userName} отклонил ваш обмен`;
    default:
      return `${userName} предлагает вам обмен`;
  }
};

const getDescriptionByType = (type: NotificationProps['type']) => {
  switch (type) {
    case 'offer':
      return 'Примите обмен, чтобы обсудить детали';
    case 'accept':
      return 'Перейдите в профиль, чтобы обсудить детали';
    case 'reject':
      return 'Попробуйте найти другой обмен';
    default:
      return 'Примите обмен, чтобы обсудить детали';
  }
};

export const Notification: React.FC<NotificationProps> = ({
  userName,
  type,
  variant = 'popup',
  isRead = false,
  timestamp,
  onAction,
  onClose,
  className = '',
  autoHideDuration = 5000,
  icon,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (variant === 'popup' && autoHideDuration > 0 && !isHovered) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [variant, autoHideDuration, onClose, isHovered]);

  if (!isVisible) return null;

  const message = getMessageByType(type, userName);
  const description = getDescriptionByType(type);
  const notificationIcon = icon || getIconByType(type);

  // для формирования списка
  if (variant === 'list') {
    return (
      <div
        className={`
          ${styles.notification}
          ${styles.list}
          ${isRead ? styles.read : styles.unread}
          ${className}
        `}
      >
        <div className={styles.topContainer}>
          <div className={styles.iconContainer}>{notificationIcon}</div>

          <div className={styles.textContainer}>
            <div className={styles.message}>{message}</div>
            <div className={styles.description}>{description}</div>

            {timestamp && (
              <div className={styles.timestamp}>
                {typeof timestamp === 'string' ? timestamp : timestamp.toLocaleDateString()}
              </div>
            )}
          </div>
        </div>

        {!isRead && onAction && (
          <Button variant="tertiary" onClick={onAction} className={styles.actionButton}>
            Перейти
          </Button>
        )}
      </div>
    );
  }

  // всплывающее
  return (
    <div
      className={`
        ${styles.notification}
        ${styles.popup}
        ${isRead ? styles.read : styles.unread}
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.iconContainer}>{notificationIcon}</div>

      <div className={styles.content}>
        <div className={styles.message}>{message}</div>
        <div className={styles.description}>{description}</div>
      </div>

      {onClose && (
        <Button
          variant="tertiary"
          onClick={() => {
            setIsVisible(false);
            onClose();
          }}
          className={styles.closeButton}
          icon={<IconUI name="cross" size={16} />}
          iconPosition="left"
          aria-label="Закрыть уведомление"
        >
          {''}
        </Button>
      )}

      {isHovered && onAction && (
        <Button variant="tertiary" onClick={onAction} className={styles.actionButton}>
          Перейти
        </Button>
      )}
    </div>
  );
};
