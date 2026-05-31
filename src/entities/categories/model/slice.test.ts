import { describe, expect, it } from 'vitest';
import type { TCategory } from '../api/types';
import { getCategories } from './actions';
import {
  categoriesSlice,
  clearCategoriesError,
  selectCategoryById,
  selectedCategories,
  selectedCategoriesById,
  selectedCategoriesError,
  selectedCategoriesIsResponse,
} from './slice';

const categories: TCategory[] = [
  { id: '1', name: 'Бизнес и карьера', type: 'business' },
  { id: '2', name: 'Творчество и искусство', type: 'creative' },
  { id: '3', name: 'Иностранные языки', type: 'languages' },
  { id: '4', name: 'Образование', type: 'education' },
  { id: '5', name: 'Дом и ремонт', type: 'home' },
  { id: '6', name: 'Здоровье и фитнес', type: 'health' },
];

const createRootState = (state = categoriesSlice.getInitialState()) =>
  ({ categories: state }) as RootState;

describe('categoriesSlice', () => {
  describe('reducer', () => {
    it('возвращает начальное состояние', () => {
      const state = categoriesSlice.reducer(undefined, { type: 'unknown' });

      expect(state).toEqual({
        categories: [],
        error: '',
        isResponse: false,
      });
    });

    it('обрабатывает getCategories pending', () => {
      const state = categoriesSlice.reducer(undefined, {
        type: getCategories.pending.type,
      });

      expect(state.isResponse).toBe(true);
      expect(state.error).toBe('');
    });

    it('обрабатывает getCategories fulfilled', () => {
      let state = categoriesSlice.reducer(undefined, {
        type: getCategories.pending.type,
      });

      state = categoriesSlice.reducer(state, {
        type: getCategories.fulfilled.type,
        payload: categories,
      });

      expect(state.categories).toEqual(categories);
      expect(state.isResponse).toBe(false);
      expect(state.error).toBe('');
    });

    it('обрабатывает getCategories rejected с сообщением об ошибке', () => {
      const errorMessage = 'Ошибка загрузки категорий';
      const state = categoriesSlice.reducer(undefined, {
        type: getCategories.rejected.type,
        error: { message: errorMessage },
      });

      expect(state.error).toBe(errorMessage);
      expect(state.isResponse).toBe(false);
    });

    it('обрабатывает getCategories rejected без сообщения об ошибке', () => {
      const state = categoriesSlice.reducer(undefined, {
        type: getCategories.rejected.type,
        error: {},
      });

      expect(state.error).toBe('Ошибка получения категорий'); // Дефолтное сообщение
      expect(state.isResponse).toBe(false);
    });

    it('очищает ошибку', () => {
      let state = categoriesSlice.reducer(undefined, {
        type: getCategories.rejected.type,
        error: { message: 'Ошибка загрузки' },
      });

      expect(state.error).toBe('Ошибка загрузки');

      state = categoriesSlice.reducer(state, clearCategoriesError());

      expect(state.error).toBe('');
      expect(state.isResponse).toBe(false);
      expect(state.categories).toEqual([]);
    });
  });

  describe('selectors', () => {
    const populatedState = categoriesSlice.reducer(undefined, {
      type: getCategories.fulfilled.type,
      payload: categories,
    });

    const rootState = createRootState(populatedState);

    it('selectedCategories возвращает все категории', () => {
      expect(selectedCategories(rootState)).toEqual(categories);
    });

    it('selectedCategoriesById возвращает категорию по id', () => {
      const selector = selectedCategoriesById(rootState);

      expect(selector('1')).toEqual(categories[0]);
      expect(selector('2')).toEqual(categories[1]);
      expect(selector('3')).toEqual(categories[2]);
      expect(selector('4')).toEqual(categories[3]);
      expect(selector('5')).toEqual(categories[4]);
      expect(selector('6')).toEqual(categories[5]);
    });

    it('selectedCategoriesById возвращает undefined для несуществующего id', () => {
      const selector = selectedCategoriesById(rootState);

      expect(selector('999')).toBeUndefined();
      expect(selector('')).toBeUndefined();
    });

    it('selectedCategoriesError возвращает ошибку', () => {
      const errorState = categoriesSlice.reducer(undefined, {
        type: getCategories.rejected.type,
        error: { message: 'Тестовая ошибка' },
      });
      const errorRootState = createRootState(errorState);

      expect(selectedCategoriesError(errorRootState)).toBe('Тестовая ошибка');
    });

    it('selectedCategoriesError возвращает пустую строку при отсутствии ошибки', () => {
      expect(selectedCategoriesError(rootState)).toBe('');
    });

    it('selectedCategoriesIsResponse возвращает статус загрузки', () => {
      const pendingState = categoriesSlice.reducer(undefined, {
        type: getCategories.pending.type,
      });
      const pendingRootState = createRootState(pendingState);

      expect(selectedCategoriesIsResponse(pendingRootState)).toBe(true);
      expect(selectedCategoriesIsResponse(rootState)).toBe(false);
    });

    it('selectedCategoriesIsResponse возвращает false для начального состояния', () => {
      const initialState = categoriesSlice.getInitialState();
      const initialRootState = createRootState(initialState);

      expect(selectedCategoriesIsResponse(initialRootState)).toBe(false);
    });
  });

  describe('createSelectors', () => {
    const populatedState = categoriesSlice.reducer(undefined, {
      type: getCategories.fulfilled.type,
      payload: categories,
    });

    const rootState = createRootState(populatedState);

    it('selectCategoryById возвращает категорию по id', () => {
      const category1 = selectCategoryById('1')(rootState);
      const category2 = selectCategoryById('2')(rootState);
      const category3 = selectCategoryById('3')(rootState);
      const category4 = selectCategoryById('4')(rootState);
      const category5 = selectCategoryById('5')(rootState);
      const category6 = selectCategoryById('6')(rootState);

      expect(category1).toEqual(categories[0]);
      expect(category2).toEqual(categories[1]);
      expect(category3).toEqual(categories[2]);
      expect(category4).toEqual(categories[3]);
      expect(category5).toEqual(categories[4]);
      expect(category6).toEqual(categories[5]);
    });

    it('selectCategoryById возвращает null для несуществующего id', () => {
      const nonExistent = selectCategoryById('999')(rootState);
      const emptyId = selectCategoryById('')(rootState);

      expect(nonExistent).toBeNull();
      expect(emptyId).toBeNull();
    });

    it('selectCategoryById работает с пустым состоянием', () => {
      const emptyState = categoriesSlice.reducer(undefined, { type: 'unknown' });
      const emptyRootState = createRootState(emptyState);

      const result = selectCategoryById('1')(emptyRootState);

      expect(result).toBeNull();
    });

    it('selectCategoryById мемоизирует результат', () => {
      const selector = selectCategoryById('1');
      const firstResult = selector(rootState);
      const secondResult = selector(rootState);

      expect(firstResult).toBe(secondResult); // Должен быть тот же объект благодаря мемоизации
    });
  });

  describe('фильтрация по типу', () => {
    const populatedState = categoriesSlice.reducer(undefined, {
      type: getCategories.fulfilled.type,
      payload: categories,
    });

    const rootState = createRootState(populatedState);
    const allCategories = selectedCategories(rootState);

    it('содержит категории всех типов', () => {
      const businessCategories = allCategories.filter((c) => c.type === 'business');
      const creativeCategories = allCategories.filter((c) => c.type === 'creative');
      const languagesCategories = allCategories.filter((c) => c.type === 'languages');
      const educationCategories = allCategories.filter((c) => c.type === 'education');
      const homeCategories = allCategories.filter((c) => c.type === 'home');
      const healthCategories = allCategories.filter((c) => c.type === 'health');

      expect(businessCategories).toHaveLength(1);
      expect(businessCategories[0].name).toBe('Бизнес и карьера');

      expect(creativeCategories).toHaveLength(1);
      expect(creativeCategories[0].name).toBe('Творчество и искусство');

      expect(languagesCategories).toHaveLength(1);
      expect(languagesCategories[0].name).toBe('Иностранные языки');

      expect(educationCategories).toHaveLength(1);
      expect(educationCategories[0].name).toBe('Образование');

      expect(homeCategories).toHaveLength(1);
      expect(homeCategories[0].name).toBe('Дом и ремонт');

      expect(healthCategories).toHaveLength(1);
      expect(healthCategories[0].name).toBe('Здоровье и фитнес');
    });
  });

  describe('edge cases', () => {
    it('не изменяет состояние при неизвестном экшене', () => {
      const initialState = categoriesSlice.getInitialState();
      const state = categoriesSlice.reducer(initialState, { type: 'unknown' });

      expect(state).toEqual(initialState);
    });

    it('корректно обрабатывает несколько последовательных экшенов', () => {
      let state = categoriesSlice.reducer(undefined, { type: 'unknown' });

      // pending
      state = categoriesSlice.reducer(state, {
        type: getCategories.pending.type,
      });
      expect(state.isResponse).toBe(true);
      expect(state.error).toBe('');

      // fulfilled
      state = categoriesSlice.reducer(state, {
        type: getCategories.fulfilled.type,
        payload: categories,
      });
      expect(state.categories).toEqual(categories);
      expect(state.isResponse).toBe(false);
      expect(state.error).toBe('');

      // pending снова
      state = categoriesSlice.reducer(state, {
        type: getCategories.pending.type,
      });
      expect(state.isResponse).toBe(true);
      expect(state.categories).toEqual(categories); // Данные сохраняются

      // rejected после pending
      state = categoriesSlice.reducer(state, {
        type: getCategories.rejected.type,
        error: { message: 'Новая ошибка' },
      });
      expect(state.error).toBe('Новая ошибка');
      expect(state.categories).toEqual(categories); // Данные не должны очищаться
      expect(state.isResponse).toBe(false);
    });

    it('сохраняет данные при ошибке', () => {
      let state = categoriesSlice.reducer(undefined, {
        type: getCategories.fulfilled.type,
        payload: categories,
      });

      expect(state.categories).toEqual(categories);

      state = categoriesSlice.reducer(state, {
        type: getCategories.rejected.type,
        error: { message: 'Ошибка' },
      });

      // Данные должны сохраниться
      expect(state.categories).toEqual(categories);
      expect(state.error).toBe('Ошибка');
      expect(state.isResponse).toBe(false);
    });

    it('обрабатывает пустой массив категорий', () => {
      const state = categoriesSlice.reducer(undefined, {
        type: getCategories.fulfilled.type,
        payload: [],
      });
      const rootState = createRootState(state);

      expect(state.categories).toEqual([]);
      expect(selectedCategories(rootState)).toEqual([]);
      expect(selectCategoryById('1')(rootState)).toBeNull();

      const selector = selectedCategoriesById(rootState);
      expect(selector('1')).toBeUndefined();
    });

    it('обрабатывает очень большое количество категорий', () => {
      const manyCategories: TCategory[] = Array.from({ length: 1000 }, (_, i) => ({
        id: String(i + 1),
        name: `Категория ${i + 1}`,
        type:
          i % 6 === 0
            ? 'business'
            : i % 6 === 1
              ? 'creative'
              : i % 6 === 2
                ? 'languages'
                : i % 6 === 3
                  ? 'education'
                  : i % 6 === 4
                    ? 'home'
                    : 'health',
      }));

      const state = categoriesSlice.reducer(undefined, {
        type: getCategories.fulfilled.type,
        payload: manyCategories,
      });
      const rootState = createRootState(state);

      expect(state.categories.length).toBe(1000);
      expect(selectCategoryById('500')(rootState)).toEqual(manyCategories[499]);
      expect(selectCategoryById('1000')(rootState)).toEqual(manyCategories[999]);
    });
  });
});
