import { describe, expect, it } from 'vitest';
import type { TSubCategory } from '../api/types';
import { getSubcategories } from './actions';
import {
  clearSubcategoriesError,
  selectSubcategoriesByCategoryId,
  selectSubcategoryById,
  selectedSubcategories,
  selectedSubcategoriesError,
  selectedSubcategoriesIsResponse,
  selectedSubcategoriesById,
  subcategoriesSlice,
} from './slice';

const subcategories: TSubCategory[] = [
  { id: '1', name: 'Маркетинг', categoryId: '1' },
  { id: '2', name: 'Продажи', categoryId: '1' },
  { id: '3', name: 'Дизайн', categoryId: '2' },
  { id: '4', name: 'Разработка', categoryId: '2' },
];

const createRootState = (state = subcategoriesSlice.getInitialState()) =>
  ({ subcategories: state }) as RootState;

describe('subcategoriesSlice', () => {
  describe('reducer', () => {
    it('возвращает начальное состояние', () => {
      const state = subcategoriesSlice.reducer(undefined, { type: 'unknown' });

      expect(state).toEqual({
        subcategories: [],
        error: '',
        isResponse: false,
      });
    });

    it('обрабатывает getSubcategories pending', () => {
      const state = subcategoriesSlice.reducer(undefined, {
        type: getSubcategories.pending.type,
      });

      expect(state.isResponse).toBe(true);
      expect(state.error).toBe('');
    });

    it('обрабатывает getSubcategories fulfilled', () => {
      let state = subcategoriesSlice.reducer(undefined, {
        type: getSubcategories.pending.type,
      });

      state = subcategoriesSlice.reducer(state, {
        type: getSubcategories.fulfilled.type,
        payload: subcategories,
      });

      expect(state.subcategories).toEqual(subcategories);
      expect(state.isResponse).toBe(false);
      expect(state.error).toBe('');
    });

    it('обрабатывает getSubcategories rejected с сообщением об ошибке', () => {
      const errorMessage = 'Ошибка загрузки подкатегорий';
      const state = subcategoriesSlice.reducer(undefined, {
        type: getSubcategories.rejected.type,
        error: { message: errorMessage },
      });

      expect(state.error).toBe(errorMessage);
      expect(state.isResponse).toBe(false);
    });

    it('обрабатывает getSubcategories rejected без сообщения об ошибке', () => {
      const state = subcategoriesSlice.reducer(undefined, {
        type: getSubcategories.rejected.type,
        error: {},
      });

      expect(state.error).toBe('Ошибка получения подкатегорий');
      expect(state.isResponse).toBe(false);
    });

    it('очищает ошибку', () => {
      let state = subcategoriesSlice.reducer(undefined, {
        type: getSubcategories.rejected.type,
        error: { message: 'Ошибка загрузки' },
      });

      expect(state.error).toBe('Ошибка загрузки');

      state = subcategoriesSlice.reducer(state, clearSubcategoriesError());

      expect(state.error).toBe('');
      expect(state.isResponse).toBe(false);
      expect(state.subcategories).toEqual([]);
    });
  });

  describe('selectors', () => {
    const populatedState = subcategoriesSlice.reducer(undefined, {
      type: getSubcategories.fulfilled.type,
      payload: subcategories,
    });

    const rootState = createRootState(populatedState);

    it('selectedSubcategories возвращает все подкатегории', () => {
      expect(selectedSubcategories(rootState)).toEqual(subcategories);
    });

    it('selectedSubcategoriesById возвращает подкатегорию по id', () => {
      const selector = selectedSubcategoriesById(rootState);

      expect(selector('1')).toEqual(subcategories[0]);
      expect(selector('2')).toEqual(subcategories[1]);
      expect(selector('3')).toEqual(subcategories[2]);
    });

    it('selectedSubcategoriesById возвращает undefined для несуществующего id', () => {
      const selector = selectedSubcategoriesById(rootState);

      expect(selector('999')).toBeUndefined();
    });

    it('selectedSubcategoriesError возвращает ошибку', () => {
      const errorState = subcategoriesSlice.reducer(undefined, {
        type: getSubcategories.rejected.type,
        error: { message: 'Тестовая ошибка' },
      });
      const errorRootState = createRootState(errorState);

      expect(selectedSubcategoriesError(errorRootState)).toBe('Тестовая ошибка');
    });

    it('selectedSubcategoriesError возвращает пустую строку при отсутствии ошибки', () => {
      expect(selectedSubcategoriesError(rootState)).toBe('');
    });

    it('selectedSubcategoriesIsResponse возвращает статус загрузки', () => {
      const pendingState = subcategoriesSlice.reducer(undefined, {
        type: getSubcategories.pending.type,
      });
      const pendingRootState = createRootState(pendingState);

      expect(selectedSubcategoriesIsResponse(pendingRootState)).toBe(true);
      expect(selectedSubcategoriesIsResponse(rootState)).toBe(false);
    });
  });

  describe('createSelectors', () => {
    const populatedState = subcategoriesSlice.reducer(undefined, {
      type: getSubcategories.fulfilled.type,
      payload: subcategories,
    });

    const rootState = createRootState(populatedState);

    it('selectSubcategoriesByCategoryId фильтрует подкатегории по categoryId', () => {
      const category1Subcategories = selectSubcategoriesByCategoryId('1')(rootState);
      const category2Subcategories = selectSubcategoriesByCategoryId('2')(rootState);
      const category3Subcategories = selectSubcategoriesByCategoryId('3')(rootState);

      expect(category1Subcategories).toEqual([subcategories[0], subcategories[1]]);
      expect(category2Subcategories).toEqual([subcategories[2], subcategories[3]]);
      expect(category3Subcategories).toEqual([]);
    });

    it('selectSubcategoryById возвращает подкатегорию по id', () => {
      const subcategory1 = selectSubcategoryById('1')(rootState);
      const subcategory2 = selectSubcategoryById('2')(rootState);
      const subcategory3 = selectSubcategoryById('3')(rootState);

      expect(subcategory1).toEqual(subcategories[0]);
      expect(subcategory2).toEqual(subcategories[1]);
      expect(subcategory3).toEqual(subcategories[2]);
    });

    it('selectSubcategoryById возвращает null для несуществующего id', () => {
      const nonExistent = selectSubcategoryById('999')(rootState);

      expect(nonExistent).toBeNull();
    });

    it('selectSubcategoriesByCategoryId работает с пустым состоянием', () => {
      const emptyState = subcategoriesSlice.reducer(undefined, { type: 'unknown' });
      const emptyRootState = createRootState(emptyState);

      const result = selectSubcategoriesByCategoryId('1')(emptyRootState);

      expect(result).toEqual([]);
    });

    it('selectSubcategoryById работает с пустым состоянием', () => {
      const emptyState = subcategoriesSlice.reducer(undefined, { type: 'unknown' });
      const emptyRootState = createRootState(emptyState);

      const result = selectSubcategoryById('1')(emptyRootState);

      expect(result).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('не изменяет состояние при неизвестном экшене', () => {
      const initialState = subcategoriesSlice.getInitialState();
      const state = subcategoriesSlice.reducer(initialState, { type: 'unknown' });

      expect(state).toEqual(initialState);
    });

    it('корректно обрабатывает несколько последовательных экшенов', () => {
      let state = subcategoriesSlice.reducer(undefined, { type: 'unknown' });

      state = subcategoriesSlice.reducer(state, {
        type: getSubcategories.pending.type,
      });
      expect(state.isResponse).toBe(true);

      state = subcategoriesSlice.reducer(state, {
        type: getSubcategories.fulfilled.type,
        payload: subcategories,
      });
      expect(state.subcategories).toEqual(subcategories);
      expect(state.isResponse).toBe(false);

      state = subcategoriesSlice.reducer(state, {
        type: getSubcategories.rejected.type,
        error: { message: 'Новая ошибка' },
      });
      expect(state.error).toBe('Новая ошибка');
      expect(state.subcategories).toEqual(subcategories);
      expect(state.isResponse).toBe(false);
    });

    it('сохраняет данные при ошибке', () => {
      let state = subcategoriesSlice.reducer(undefined, {
        type: getSubcategories.fulfilled.type,
        payload: subcategories,
      });

      state = subcategoriesSlice.reducer(state, {
        type: getSubcategories.rejected.type,
        error: { message: 'Ошибка' },
      });

      expect(state.subcategories).toEqual(subcategories);
      expect(state.error).toBe('Ошибка');
    });
  });
});
