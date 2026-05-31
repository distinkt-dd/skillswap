import { useEffect, useState, type FC } from 'react';
import styles from './offer-card.module.css';

import { useDispatch, useSelector } from '@shared/store';
import { selectedSubcategories } from '@entities/subcategories/model/slice';
import { Button, IconUI } from '@shared/index';
import { selectedCategories } from '@entities/categories/model';
import { CarouselUI } from '@shared/ui';
import type { TOffer } from '@entities/offers/api/types';
import { selectedUser } from '@entities/user';
import ModalInfo from '@widgets/models/models.notifications';
import clsx from 'clsx';
import { updateOffer } from '@entities/offers';

type TOfferCardUI = {
  userId?: string | undefined;
  offer: TOffer;
  className?: string;
};

export type TSavedOffersData = Record<string, string[]>;

export const OfferCardUI: FC<TOfferCardUI> = ({ offer, userId, className }) => {
  const dispatch = useDispatch();
  const subCategories = useSelector(selectedSubcategories);
  const categories = useSelector(selectedCategories);
  const subCategory = subCategories?.find((item) => item.id === offer.subcategoryId);
  const category = categories?.find((item) => item.id === subCategory?.categoryId);
  const user = useSelector(selectedUser);

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

  const handleOfferClick = () => {
    setModalOpen(true);
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
