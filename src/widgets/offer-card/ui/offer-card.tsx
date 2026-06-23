import { useEffect, useState, type FC } from 'react';
import styles from './offer-card.module.css';

import {
  createApplication,
  fetchReceivedApplications,
  selectReceivedApplications,
  updateApplicationStatus,
} from '@entities/application';
import { selectedCategories } from '@entities/categories/model';
import { updateOffer } from '@entities/offers';
import type { TOffer } from '@entities/offers/api/types';
import { selectedMyOffer } from '@entities/offers/model/slice';
import { selectedSubcategories } from '@entities/subcategories/model/slice';
import { selectedUser } from '@entities/user';
import { Button, IconUI } from '@shared/index';
import { useDispatch, useSelector } from '@shared/store';
import { CarouselUI } from '@shared/ui';
import ModalInfo from '@widgets/models/models.notifications';
import clsx from 'clsx';

type TOfferCardUI = {
  userId?: string | undefined;
  offer: TOffer;
  className?: string;
  recivedId?: string;
  isRecivedAccepted?: boolean;
};

export type TSavedOffersData = Record<string, string[]>;

export const OfferCardUI: FC<TOfferCardUI> = ({
  offer,
  userId,
  className,
  recivedId,
  isRecivedAccepted,
}) => {
  const dispatch = useDispatch();
  const subCategories = useSelector(selectedSubcategories);
  const categories = useSelector(selectedCategories);
  const subCategory = subCategories?.find((item) => item.id === offer.subcategoryId);
  const category = categories?.find((item) => item.id === subCategory?.categoryId);
  const user = useSelector(selectedUser);
  const myOffer = useSelector(selectedMyOffer);
  const recivedOffers = useSelector(selectReceivedApplications).map((item) => item.offer);
  const offerInRecived = recivedOffers.some((o) => o.id === offer.id);

  const [userOffers, setUserOffers] = useState<TSavedOffersData | null>(() => {
    try {
      const savedOffers = localStorage.getItem('offers');
      return savedOffers ? JSON.parse(savedOffers) : null;
    } catch (error) {
      console.error('Ошибка', error);
      return null;
    }
  });

  useEffect(() => {
    if (userOffers) {
      try {
        localStorage.setItem('offers', JSON.stringify(userOffers));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
  }, [userOffers]);

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const isOfferAlreadyProposed = user && userOffers?.[user.id]?.includes(offer.id);

  const handleCloseModal = () => {
    setModalOpen(false);

    if (user && offer) {
      setUserOffers((prev) => {
        const currentOffers = prev || {};
        const userOffersList = currentOffers[user.id] || [];

        if (!userOffersList.includes(offer.id)) {
          const newOffersData: TSavedOffersData = {
            ...currentOffers,
            [user.id]: [...userOffersList, offer.id],
          };
          return newOffersData;
        }

        return currentOffers;
      });
    }
  };

  const handleOfferClick = async () => {
    if (myOffer) {
      const application = await dispatch(
        createApplication({ offerId: myOffer.id, userToId: offer.userId })
      );
      if (application) {
        setModalOpen(true);
      }
    }
  };

  const handleLikeOffer = () => {
    if (!offer || !user) return;

    const usrLikes = offer.userLikedIds || [];
    const userId = user.id;

    if (usrLikes.includes(userId)) {
      const temp = usrLikes.filter((item) => item !== userId);
      dispatch(updateOffer({ ...offer, userLikedIds: temp }));
    } else {
      const temp = [...usrLikes, userId];
      dispatch(updateOffer({ ...offer, userLikedIds: temp }));
    }
  };

  const setStatusRecived = (status: 'ACCEPTED' | 'REJECTED') => {
    if (!recivedId) {
      return;
    }
    dispatch(updateApplicationStatus({ applicationId: recivedId, status }));
    dispatch(fetchReceivedApplications());
  };

  return (
    <div className={clsx(styles.offerCard, className)}>
      <div className={styles.offerCard__controls}>
        {!offer.userLikedIds.includes(userId) ? (
          <button onClick={() => handleLikeOffer()}>
            <IconUI name="like" />
          </button>
        ) : (
          <button onClick={() => handleLikeOffer()}>
            <IconUI name="likeFilled" />
          </button>
        )}

        <button>
          <IconUI name="share" />
        </button>
        <button>
          <IconUI name="moreSquare" />
        </button>
      </div>

      <div className={styles.offerCard__container}>
        <div className={styles.offerCard__content}>
          <h1>{offer.name}</h1>
          <span className={styles.offerCard__categories}>
            {category?.name} / {subCategory?.name}
          </span>
          <p className={styles.offerCard__description}>{offer.description}</p>

          {user?.id === offer.userId ? (
            <Button className={styles.offerCard__button} disabled>
              Это ваше предложение
            </Button>
          ) : isOfferAlreadyProposed ? (
            <Button
              className={styles.offerCard__button}
              icon={<IconUI name="clock" />}
              variant="secondary"
            >
              Обмен предложен
            </Button>
          ) : offerInRecived ? (
            <>
              <Button
                className={styles.offerCard__button}
                onClick={() => setStatusRecived('ACCEPTED')}
              >
                Принять
              </Button>
              <Button
                className={styles.offerCard__button}
                onClick={() => setStatusRecived('REJECTED')}
              >
                Отклонить
              </Button>
            </>
          ) : isRecivedAccepted ? (
            <Button className={styles.offerCard__button} onClick={handleOfferClick}>
              Закончить сотрудничество
            </Button>
          ) : (
            <Button className={styles.offerCard__button} onClick={handleOfferClick}>
              Предложить обмен
            </Button>
          )}
        </div>
        <CarouselUI className={styles.offerCard__carousel} images={offer.images} />
      </div>

      {user ? (
        <ModalInfo type="success" isOpen={modalOpen} onClose={handleCloseModal} />
      ) : (
        <ModalInfo type="registration" isOpen={modalOpen} onClose={handleCloseModal} />
      )}
    </div>
  );
};
