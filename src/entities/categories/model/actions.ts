import { createAsyncThunk } from '@reduxjs/toolkit';
import { CategoriesApi } from '../api/categories-api';
import type { TCategory } from '../api/types';

const categoriesApi = new CategoriesApi();

export const getCategories = createAsyncThunk<TCategory[]>('categories/getAll', async () => {
  return await categoriesApi.getCategories();
});
