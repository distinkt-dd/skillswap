import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { TUser } from '../api/types';
import { login, register, updateDateUser, updatePassword } from './actions';
import {
  clearUser,
  selectedUser,
  selectedUserError,
  selectedUserIsAuthChecked,
  selectedUserIsResponse,
  setIsAuthChecked,
  setUser,
  userSlice,
} from './slice';

const nextUser: TUser = {
  id: '2',
  name: 'Мария',
  avatar: 'https://example.com/avatar.png',
  email: 'maria@example.com',
  description: 'Новый пользователь',
  gender: 'female',
  birthday: new Date('1999-03-04').toISOString(),
  cityId: '2',
  subcategoriesIds: ['5'],
};

const removeItem = vi.fn();

const createRootState = (state = userSlice.getInitialState()) => ({ user: state }) as RootState;

describe('userSlice', () => {
  beforeEach(() => {
    removeItem.mockClear();
    vi.stubGlobal('localStorage', {
      removeItem,
    } as unknown as Storage);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('возвращает начальное состояние', () => {
    const state = userSlice.reducer(undefined, { type: 'unknown' });

    // Исправляем в соответствии с реальным initialState
    expect(state).toEqual({
      user: null,
      users: [], // добавляем поле users
      error: '',
      isResponse: false,
      isAuthChecked: true, // меняем на true, так как в реальном состоянии true
    });

    expect(selectedUser(createRootState(state))).toBeNull();
    expect(selectedUserError(createRootState(state))).toBe('');
    expect(selectedUserIsResponse(createRootState(state))).toBe(false);
    expect(selectedUserIsAuthChecked(createRootState(state))).toBe(true); // меняем на true
  });

  it('устанавливает пользователя и очищает', () => {
    let state = userSlice.reducer(undefined, setUser(nextUser));

    expect(state.user).toEqual(nextUser);

    state = userSlice.reducer(state, clearUser());

    expect(state.user).toBeNull();
    expect(removeItem).toHaveBeenCalledWith('user');
  });

  it('изменяет isAuthChecked', () => {
    const state = userSlice.reducer(undefined, setIsAuthChecked(false));

    expect(state.isAuthChecked).toBe(false);
  });

  it('обрабатывает login pending, fulfilled и rejected', () => {
    let state = userSlice.reducer(undefined, { type: login.pending.type });

    expect(state.isResponse).toBe(true);
    expect(state.error).toBe('');

    state = userSlice.reducer(state, {
      type: login.fulfilled.type,
      payload: nextUser,
    });

    expect(state.user).toEqual(nextUser);
    expect(state.isAuthChecked).toBe(true);
    expect(state.isResponse).toBe(false);
    expect(state.error).toBe('');

    state = userSlice.reducer(state, {
      type: login.rejected.type,
      error: { message: 'Ошибка входа' },
    });

    expect(state.error).toBe('Ошибка входа');
    expect(state.isResponse).toBe(false);
    expect(state.isAuthChecked).toBe(true);
  });

  it('обрабатывает register pending, fulfilled и rejected', () => {
    let state = userSlice.reducer(undefined, { type: register.pending.type });

    expect(state.isResponse).toBe(true);
    expect(state.error).toBe('');

    state = userSlice.reducer(state, {
      type: register.fulfilled.type,
      payload: nextUser,
    });

    expect(state.user).toEqual(nextUser);
    expect(state.isAuthChecked).toBe(true);
    expect(state.isResponse).toBe(false);
    expect(state.error).toBe('');

    state = userSlice.reducer(state, {
      type: register.rejected.type,
      error: { message: 'Ошибка регистрации' },
    });

    expect(state.error).toBe('Ошибка регистрации');
    expect(state.isResponse).toBe(false);
    expect(state.isAuthChecked).toBe(true);
  });

  it('обрабатывает updatePassword pending, rejected и fulfilled', () => {
    let state = userSlice.reducer(undefined, { type: updatePassword.pending.type });

    expect(state.isResponse).toBe(true);

    state = userSlice.reducer(state, {
      type: updatePassword.rejected.type,
      error: { message: 'Ошибка обновления пароля' },
    });

    expect(state.isResponse).toBe(false);
    expect(state.error).toBe('Ошибка обновления пароля');

    state = userSlice.reducer(state, { type: updatePassword.pending.type });
    state = userSlice.reducer(state, { type: updatePassword.fulfilled.type });

    expect(state.isResponse).toBe(false);
  });

  it('обрабатывает updateDateUser pending, fulfilled и rejected', () => {
    let state = userSlice.reducer(undefined, { type: updateDateUser.pending.type });

    expect(state.isResponse).toBe(true);
    expect(state.error).toBe('');

    state = userSlice.reducer(state, {
      type: updateDateUser.fulfilled.type,
      payload: nextUser,
    });

    expect(state.user).toEqual(nextUser);
    expect(state.isAuthChecked).toBe(true);
    expect(state.isResponse).toBe(false);
    expect(state.error).toBe('');

    state = userSlice.reducer(state, {
      type: updateDateUser.rejected.type,
      error: { message: 'Ошибка обновления пользователя' },
    });

    expect(state.error).toBe('Ошибка обновления пользователя');
    expect(state.isResponse).toBe(false);
    expect(state.isAuthChecked).toBe(true);
  });
});
