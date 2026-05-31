import { createSlice } from '@reduxjs/toolkit';
import type { TOffer } from '../api/types';
import { getOffers, getOfferById, createOffer, updateOffer, removeOffer } from './actions';

type TOffersState = {
  offers: TOffer[];
  currentOffer: TOffer | null;
  isResponse: boolean;
  error: string | null;
};

const initialState: TOffersState = {
  offers: [],
  currentOffer: null,
  isResponse: false,
  error: null,
};

export const offersSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {
    clearCurrentOffer(state) {
      state.currentOffer = null;
    },
    clearOffersError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOffers.pending, (state) => {
        state.isResponse = true;
        state.error = null;
      })
      .addCase(getOffers.fulfilled, (state, action) => {
        state.isResponse = false;
        state.offers = action.payload;
      })
      .addCase(getOffers.rejected, (state, action) => {
        state.isResponse = false;
        state.error = action.payload as string;
      })

      .addCase(getOfferById.pending, (state) => {
        state.isResponse = true;
        state.error = null;
      })
      .addCase(getOfferById.fulfilled, (state, action) => {
        state.isResponse = false;
        state.currentOffer = action.payload;
      })
      .addCase(getOfferById.rejected, (state, action) => {
        state.isResponse = false;
        state.error = action.payload as string;
      })

      .addCase(createOffer.pending, (state) => {
        state.isResponse = true;
        state.error = null;
      })
      .addCase(createOffer.fulfilled, (state, action) => {
        state.isResponse = false;
        state.offers.push(action.payload);
      })
      .addCase(createOffer.rejected, (state, action) => {
        state.isResponse = false;
        state.error = action.payload as string;
      })

      .addCase(updateOffer.pending, (state) => {
        state.isResponse = true;
        state.error = null;
      })
      .addCase(updateOffer.fulfilled, (state, action) => {
        state.isResponse = false;
        state.offers = state.offers.map((offer) =>
          offer.id === action.payload.id ? action.payload : offer
        );
        if (state.currentOffer?.id === action.payload.id) {
          state.currentOffer = action.payload;
        }
      })
      .addCase(updateOffer.rejected, (state, action) => {
        state.isResponse = false;
        state.error = action.payload as string;
      })

      .addCase(removeOffer.pending, (state) => {
        state.isResponse = true;
        state.error = null;
      })
      .addCase(removeOffer.fulfilled, (state, action) => {
        state.isResponse = false;
        state.offers = state.offers.filter((offer) => offer.id !== action.payload.id);
        if (state.currentOffer?.id === action.payload.id) {
          state.currentOffer = null;
        }
      })
      .addCase(removeOffer.rejected, (state, action) => {
        state.isResponse = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentOffer, clearOffersError } = offersSlice.actions;
export const offersReducer = offersSlice.reducer;

export const selectedOffers = (state: RootState) => state.offers.offers;
export const selectedCurrentOffer = (state: RootState) => state.offers.currentOffer;
export const selectedOffersIsResponse = (state: RootState) => state.offers.isResponse;
export const selectedOffersError = (state: RootState) => state.offers.error;
