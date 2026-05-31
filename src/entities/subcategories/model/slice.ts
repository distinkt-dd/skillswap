import { createSelector, createSlice } from '@reduxjs/toolkit';
import type { TSubCategory } from '../api/types';
import { getSubcategories } from './actions';

type TSubcategoriesState = {
  subcategories: TSubCategory[];
  error: string;
  isResponse: boolean;
};

const initialState: TSubcategoriesState = {
  subcategories: [],
  error: '',
  isResponse: false,
};

export const subcategoriesSlice = createSlice({
  name: 'subcategories',
  initialState,
  reducers: {
    clearSubcategoriesError: (state) => {
      state.error = '';
    },
  },
  selectors: {
    selectedSubcategories: (state) => state.subcategories,
    selectedSubcategoriesById: (state) => (id: string) => {
      return state.subcategories.find((item) => item.id === id);
    },
    selectedSubcategoriesError: (state) => state.error,
    selectedSubcategoriesIsResponse: (state) => state.isResponse,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSubcategories.pending, (state) => {
        state.isResponse = true;
        state.error = '';
      })
      .addCase(getSubcategories.fulfilled, (state, action) => {
        state.subcategories = action.payload;
        state.isResponse = false;
      })
      .addCase(getSubcategories.rejected, (state, action) => {
        state.error = action.error.message ?? 'Ошибка получения подкатегорий';
        state.isResponse = false;
      });
  },
});

export const { clearSubcategoriesError } = subcategoriesSlice.actions;

export const {
  selectedSubcategoriesById,
  selectedSubcategories,
  selectedSubcategoriesError,
  selectedSubcategoriesIsResponse,
} = subcategoriesSlice.selectors;

export const selectSubcategoriesByCategoryId = (categoryId: string) =>
  createSelector([selectedSubcategories], (subcategories) =>
    subcategories.filter((subcategory) => subcategory.categoryId === categoryId)
  );

export const selectSubcategoryById = (subcategoryId: string) =>
  createSelector(
    [selectedSubcategories],
    (subcategories) => subcategories.find((subcategory) => subcategory.id === subcategoryId) ?? null
  );
