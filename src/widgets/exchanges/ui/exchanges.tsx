import type { FC } from 'react';
import styles from './exchanges.module.css';
import { useSelector } from '@shared/store';
import { selectedOffers } from '@entities/offers';
import { selectedUser } from '@entities/user';
import { OfferCardUI } from '@widgets/offer-card/ui';

export const Exchanges: FC = () => {
  const user = useSelector(selectedUser);
  const offers = useSelector(selectedOffers);

  const exchanges = localStorage.getItem('offers');

  if (!exchanges) {
    return <p className={styles.noContent}>Пока что вы еще не предложили обмен</p>;
  }

  const parsed = JSON.parse(exchanges);

  const filteredOffers = offers.filter((item) => parsed[user?.id as string]?.includes(item.id));

  if (!filteredOffers.length) {
    return <p className={styles.noContent}>Нет доступных предложений для обмена</p>;
  }

  return (
    <div className={styles.exchanges}>
      {filteredOffers.map((item) => (
        <OfferCardUI key={item.id} offer={item} userId={user?.id} />
      ))}
    </div>
  );
};
