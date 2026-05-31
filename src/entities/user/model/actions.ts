// actions.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { TLoginUser, TRegisterUser, TUpdateUser, TUpdateUserPass, TUser } from '../api/types';
import { UserApi } from '../api/user';

const userApi = new UserApi();

export const login = createAsyncThunk<TUser, TLoginUser>(
  'user/login',
  async (payload: TLoginUser) => {
    return await userApi.userLogin(payload);
  }
);

export const register = createAsyncThunk<TUser, TRegisterUser>(
  'user/register',
  async (payload: TRegisterUser) => {
    return await userApi.userRegister(payload);
  }
);

export const checkUserAuth = createAsyncThunk<TUser | null>('user/checkUserAuth', async () => {
  return userApi.getUserFromStorage();
});

export const updatePassword = createAsyncThunk<void, TUpdateUserPass>(
  'user/updatePass',
  async (payload: TUpdateUserPass) => {
    return await userApi.userPassUpdate(payload);
  }
);

export const updateDateUser = createAsyncThunk<TUser, TUpdateUser>(
  'user/updateDataUser',
  async (payload: TUpdateUser) => {
    return await userApi.userDataUpdate(payload);
  }
);

export const fetchUsers = createAsyncThunk<TUser[]>('user/fetchUsers', async () => {
  return await userApi.getUsers();
});

// Дополнительно: экшен для логаута (очистка)
export const logout = createAsyncThunk('user/logout', async () => {
  userApi.clearAuthData();
});
