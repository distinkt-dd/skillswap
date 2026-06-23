import { selectAcceptedOffers } from '@entities/application';
import { selectedUser } from '@entities/user';
import { useSelector } from '@shared/store';
import { OfferCardUI } from '@widgets/offer-card/ui';
import { type FC } from 'react';
import styles from './exchanges.module.css';

export const Exchanges: FC = () => {
  const user = useSelector(selectedUser);

  const offers = useSelector(selectAcceptedOffers);

  if (!offers.length) {
    return <p className={styles.noContent}>Нет доступных предложений для обмена</p>;
  }

  return (
    <div className={styles.exchanges}>
      {offers.map((item) => (
        <OfferCardUI
          key={item.id}
          offer={item.offer}
          recivedId={item.id}
          isRecivedAccepted
          userId={user?.id}
        />
      ))}
    </div>
  );
};
