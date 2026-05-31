import { createAsyncThunk } from '@reduxjs/toolkit';
import { CitiesApi } from '../api/cities-api';

export const fetchCities = createAsyncThunk('cities/getCities', async () => {
  const api = new CitiesApi();
  return await api.getCities();
});
