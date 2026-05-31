import { Notification } from '@shared/ui';
import styles from './Notification.module.css';
export const NotificationWrapper = () => {
  return (
    <div className={styles.notification}>
      <div className={styles.notificationContent}>
        <div className={styles.notificationContentText}>
          <h2>Новые уведомления</h2>
          <p>Прочитать все</p>
        </div>
        <Notification
          userName="Павел"
          type="offer"
          variant="list"
          timestamp="23.03.2026"
          isRead={false}
          onAction={() => ''}
        />
        <Notification
          userName="Татьяна"
          type="offer"
          variant="list"
          timestamp="Вчера"
          isRead={false}
          onAction={() => ''}
        />
      </div>
      <div className={styles.notificationContent}>
        <div className={styles.notificationContentText}>
          <h2>Просмотренные</h2>
          <p>Очистить</p>
        </div>
        <Notification
          userName="Павел"
          type="offer"
          variant="list"
          timestamp="23.03.2026"
          isRead={true}
        />
        <Notification
          userName="Татьяна"
          type="offer"
          variant="list"
          timestamp="Вчера"
          isRead={true}
        />
      </div>
    </div>
  );
};
