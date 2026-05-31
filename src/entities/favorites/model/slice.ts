import { createSlice } from '@reduxjs/toolkit';
import { addFavorite, deleteFavorite, getFavorites } from './actions';

type TFavoritesState = {
  users: string[]; // Массив ID пользователей
  isLoading: boolean;
  error: string | null;
};

const initialState: TFavoritesState = {
  users: [],
  isLoading: false,
  error: null,
};

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {},
  selectors: {
    selectFavorites: (state) => state.users, // Возвращает массив ID
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFavorites.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFavorites.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload; // action.payload: string[]
      })
      .addCase(getFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(addFavorite.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload; // action.payload: string (userId)
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteFavorite.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteFavorite.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = state.users.filter((userId) => userId !== action.payload); // action.payload: string (userId)
      })
      .addCase(deleteFavorite.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { selectFavorites } = favoritesSlice.selectors;
