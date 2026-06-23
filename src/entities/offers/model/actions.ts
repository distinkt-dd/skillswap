import { createAsyncThunk } from '@reduxjs/toolkit';
import { OffersApi } from '../api/offers';
import type { TOfferCreate, TOfferUpdate } from '../api/types';

const offersApi = new OffersApi();

export const getOffers = createAsyncThunk('offers/getOffers', async (_, { rejectWithValue }) => {
  try {
    return await offersApi.getOffers();
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const getOfferById = createAsyncThunk(
  'offers/getOfferById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await offersApi.getOfferById(id);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getOfferByUser = createAsyncThunk(
  'offers/getOfferByUser',
  async (id: string, { rejectWithValue }) => {
    try {
      return await offersApi.getOfferByUser(id);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const createOffer = createAsyncThunk(
  'offers/createOffer',
  async ({ userId, data }: { userId: string; data: TOfferCreate }, { rejectWithValue }) => {
    try {
      return await offersApi.createOffer(userId, data);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateOffer = createAsyncThunk(
  'offers/updateOffer',
  async (data: TOfferUpdate, { rejectWithValue }) => {
    try {
      return await offersApi.offerDataUpdate(data);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const removeOffer = createAsyncThunk(
  'offers/removeOffer',
  async (id: string, { rejectWithValue }) => {
    try {
      return await offersApi.offerRemove(id);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
