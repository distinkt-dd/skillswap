import type { FC } from 'react';
import styles from './my-offers.module.css';
import { useSelector } from '@shared/store';
import { selectedOffers } from '@entities/offers';
import { selectedUser } from '@entities/user';
import { OfferCardUI } from '@widgets/offer-card/ui';

export const MyOffers: FC = () => {
  const user = useSelector(selectedUser);
  const offer = useSelector(selectedOffers).find((item) => item.userId === user?.id);

  if (!offer || !user) {
    return <p className={styles.noContent}>Хм...странно! должно что то быть</p>;
  }

  return (
    <div className={styles.myOffers}>
      <OfferCardUI offer={offer} userId={user?.id} />
    </div>
  );
};
