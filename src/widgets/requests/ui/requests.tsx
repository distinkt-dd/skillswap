import { selectReceivedApplications } from '@entities/application';
import { selectedUser } from '@entities/user';
import { useSelector } from '@shared/store';
import { OfferCardUI } from '@widgets/offer-card/ui';
import type { FC } from 'react';
import styles from './requests.module.css';

export const RequestsWidget: FC = () => {
  const user = useSelector(selectedUser);
  const offers = useSelector(selectReceivedApplications);

  if (!offers.length) {
    return <p className={styles.noContent}>Вам никто не предлагал обмен!</p>;
  }

  return (
    <div className={styles.exchanges}>
      {offers.map((item) => (
        <OfferCardUI key={item.id} offer={item.offer} recivedId={item.id} userId={user?.id} />
      ))}
    </div>
  );
};
