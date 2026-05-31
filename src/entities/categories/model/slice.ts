import { createSelector, createSlice } from '@reduxjs/toolkit';
import type { TCategory } from '../api/types';
import { getCategories } from './actions';

type TCategoriesState = {
  categories: TCategory[];
  error: string;
  isResponse: boolean;
};

const initialState: TCategoriesState = {
  categories: [],
  error: '',
  isResponse: false,
};

export const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearCategoriesError: (state) => {
      state.error = '';
    },
  },
  selectors: {
    selectedCategories: (state) => state.categories,
    selectedCategoriesById: (state) => (id: string) => {
      return state.categories.find((item) => item.id === id);
    },
    selectedCategoriesError: (state) => state.error,
    selectedCategoriesIsResponse: (state) => state.isResponse,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state) => {
        state.isResponse = true;
        state.error = '';
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.isResponse = false;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.error = action.error.message ?? 'Ошибка получения категорий';
        state.isResponse = false;
      });
  },
});

export const { clearCategoriesError } = categoriesSlice.actions;

export const {
  selectedCategories,
  selectedCategoriesById,
  selectedCategoriesError,
  selectedCategoriesIsResponse,
} = categoriesSlice.selectors;

export const selectCategoryById = (categoryId: string) =>
  createSelector(
    [selectedCategories],
    (categories) => categories.find((category) => category.id === categoryId) ?? null
  );
