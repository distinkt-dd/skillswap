import {
  clearCurrentOffer,
  selectedCurrentOffer,
  selectedOffersIsResponse,
} from '@entities/offers/model';
import { getOfferById } from '@entities/offers/model/actions';
import { useDispatch, useSelector } from '@shared/store';
import { ClosestOffers } from '@widgets/closest-offers';
import { OfferCardInfo } from '@widgets/index';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './offer.module.css';

export const OfferPage = () => {
  const { id } = useParams<{ id: string }>();

  const isLoading = useSelector(selectedOffersIsResponse);
  const offer = useSelector(selectedCurrentOffer);
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(getOfferById(id));
    }
    return () => {
      dispatch(clearCurrentOffer());
    };
  }, [dispatch, id]);

  if (!offer) {
    return <p>Offer is not available</p>;
  }

  if (isLoading) return <p>LOADING...</p>;

  return (
    <div className={`container ${styles.container}`}>
      <OfferCardInfo offer={offer} />
      <ClosestOffers offer={offer} />
    </div>
  );
};
