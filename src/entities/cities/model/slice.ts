import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TCity } from '../api/types';
import { fetchCities } from './actions';

export type TCityState = {
  cities: TCity[] | null;
  selectedCity: TCity | null;
  isLoading: boolean;
  error?: string;
};

const initialState: TCityState = {
  cities: null,
  selectedCity: null,
  isLoading: false,
};

export const citiesSlice = createSlice({
  name: 'cities',
  initialState,
  reducers: {
    setCities: (state, action: PayloadAction<TCity[] | null>) => {
      state.cities = action.payload;
    },
    setSelectedCityById: (state, action: PayloadAction<string>) => {
      const city = state.cities?.find((city) => city.id === action.payload);
      state.selectedCity = city || null;
    },
  },
  selectors: {
    selectCities: (state) => state.cities,
    selectSelectedCity: (state) => state.selectedCity,
    selectCitiesIsLoading: (state) => state.isLoading,
    selectCitiesError: (state) => state.error,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCities.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cities = action.payload;
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { selectCities, selectSelectedCity, selectCitiesIsLoading, selectCitiesError } =
  citiesSlice.selectors;
export const { setCities, setSelectedCityById } = citiesSlice.actions;
