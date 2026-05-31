import { OfferCardInfo } from '@widgets/index';
import { useParams } from 'react-router-dom';
import { getOfferById } from '@entities/offers/model/actions';
import { useSelector, useDispatch } from '@shared/store';
import { useEffect } from 'react';
import {
  clearCurrentOffer,
  selectedCurrentOffer,
  selectedOffersIsResponse,
} from '@entities/offers/model';
import { ClosestOffers } from '@widgets/closest-offers';

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
    <div className="container">
      <OfferCardInfo offer={offer} />
      <ClosestOffers offer={offer} />
    </div>
  );
};
