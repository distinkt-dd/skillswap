import { createAsyncThunk } from '@reduxjs/toolkit';
import { SubCategoriesApi } from '../api/subcategories-api';
import type { TSubCategory } from '../api/types';

const subcategoriesApi = new SubCategoriesApi();

export const getSubcategories = createAsyncThunk<TSubCategory[]>(
  'subcategories/getSubcategories',
  async () => {
    return await subcategoriesApi.getSubCategories();
  }
);
