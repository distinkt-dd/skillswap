export { offersSlice, offersReducer } from './slice';
export { clearCurrentOffer, clearOffersError } from './slice';
export { getOffers, getOfferById, createOffer, updateOffer, removeOffer } from './actions';
export {
  selectedOffers,
  selectedCurrentOffer,
  selectedOffersIsResponse,
  selectedOffersError,
} from './slice';
