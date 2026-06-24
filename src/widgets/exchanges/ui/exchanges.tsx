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
      {offers.map((item) =>
        item.offer.userId === user?.id ? (
          <OfferCardUI
            key={item.offerTo.id}
            offer={item.offerTo}
            recivedId={item.id}
            recivedStatus={item.status}
            isRecivedAccepted
            userId={item.offerTo.userId}
          />
        ) : (
          <OfferCardUI
            key={item.offer.id}
            offer={item.offer}
            recivedId={item.id}
            recivedStatus={item.status}
            isRecivedAccepted
            userId={user?.id}
          />
        )
      )}
    </div>
  );
};
