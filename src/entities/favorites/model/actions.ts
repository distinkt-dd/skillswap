// actions.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { FavoritesApi } from '../api/favorites-api';

const favoritesApi = new FavoritesApi();

export const getFavorites = createAsyncThunk<string[]>(
  'favorites/getFavorites',
  async (_, { rejectWithValue }) => {
    try {
      return await favoritesApi.getFavorites();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const addFavorite = createAsyncThunk<string[], string>(
  'favorites/addFavorite',
  async (userId: string, { rejectWithValue }) => {
    try {
      return await favoritesApi.addFavorite(userId); // Возвращает обновленный массив
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const deleteFavorite = createAsyncThunk<string, string>(
  'favorites/deleteFavorite',
  async (userId: string, { rejectWithValue }) => {
    try {
      await favoritesApi.deleteFavorite(userId);
      return userId; // Возвращаем удаленный ID
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);
