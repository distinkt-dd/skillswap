import {
  deleteApplications,
  fetchReceivedApplications,
  type ReceivedApplication,
  type RejectedApplication,
} from '@entities/application';
import { useDispatch } from '@shared/store';
import { Notification } from '@shared/ui';
import { useNavigate } from 'react-router-dom';
import styles from './Notification.module.css';

interface NotificationProps {
  applications: ReceivedApplication[];
  rejectedApplications?: RejectedApplication[];
}

export const NotificationWrapper = ({ applications, rejectedApplications }: NotificationProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onAction = async (type: string, appId: string) => {
    switch (type) {
      case 'offer':
        return navigate('/requests');
      case 'reject':
        await dispatch(deleteApplications({ appId }));
        await navigate('/catalog');
        return await dispatch(fetchReceivedApplications());
    }
  };
  return (
    <div className={styles.notification}>
      <div className={styles.notificationContent}>
        <div className={styles.notificationContentText}>
          <h2>Новые уведомления</h2>
        </div>
        {applications.length > 0 ? (
          applications.map((app) => (
            <Notification
              key={app.id}
              userName={app.userFrom.name}
              type="offer"
              variant="list"
              isRead={false}
              onAction={() => onAction('offer', app.id)}
            />
          ))
        ) : (
          <p>На данный момент, вам никто не предлагал обмен!</p>
        )}
      </div>
      {rejectedApplications ? (
        <div className={styles.notificationContent}>
          <div className={styles.notificationContentText}>
            <h2>Новые уведомления</h2>
          </div>
          {rejectedApplications.length > 0 ? (
            rejectedApplications.map((app) => (
              <Notification
                key={app.id}
                userName={app.userTo.name}
                type="reject"
                variant="list"
                isRead={false}
                onAction={() => onAction('reject', app.id)}
              />
            ))
          ) : (
            <p>На данный момент, вам никто не предлагал обмен!</p>
          )}
        </div>
      ) : (
        ''
      )}
    </div>
  );
};
