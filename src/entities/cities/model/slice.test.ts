import { describe, expect, it } from 'vitest';
import type { TCity } from '../api/types';
import { fetchCities } from './actions';
import {
  citiesSlice,
  selectCities,
  selectSelectedCity,
  setCities,
  setSelectedCityById,
} from './slice';

const cities: TCity[] = [
  { id: '1', name: 'Москва' },
  { id: '2', name: 'Казань' },
];

const createRootState = (state = citiesSlice.getInitialState()) => ({ cities: state }) as RootState;

describe('citiesSlice', () => {
  it('возвращает начальное состояние', () => {
    const state = citiesSlice.reducer(undefined, { type: 'unknown' });

    expect(state).toEqual({
      cities: null,
      selectedCity: null,
      isLoading: false,
    });
  });

  it('устанавливает список городов и выбранный город по id', () => {
    let state = citiesSlice.reducer(undefined, setCities(cities));
    state = citiesSlice.reducer(state, setSelectedCityById('2'));

    expect(state.cities).toEqual(cities);
    expect(state.selectedCity).toEqual(cities[1]);
    expect(selectCities(createRootState(state))).toEqual(cities);
    expect(selectSelectedCity(createRootState(state))).toEqual(cities[1]);
  });

  it('устанавливает selectedCity в null, если id не найден', () => {
    let state = citiesSlice.reducer(undefined, setCities(cities));
    state = citiesSlice.reducer(state, setSelectedCityById('999'));

    expect(state.selectedCity).toBeNull();
  });

  it('обрабатывает fetchCities pending, fulfilled и rejected', () => {
    let state = citiesSlice.reducer(undefined, { type: fetchCities.pending.type });

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeUndefined();

    state = citiesSlice.reducer(state, {
      type: fetchCities.fulfilled.type,
      payload: cities,
    });

    expect(state.isLoading).toBe(false);
    expect(state.cities).toEqual(cities);

    state = citiesSlice.reducer(state, {
      type: fetchCities.rejected.type,
      error: { message: 'Ошибка загрузки' },
    });

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });
});
