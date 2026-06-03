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

// ТЕПЕРЬ: Запрашивает данные с сервера
export const checkUserAuth = createAsyncThunk<TUser | null>('user/checkUserAuth', async () => {
  const data = await userApi.checkMe();
  return data ? data.user : null;
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

export const logout = createAsyncThunk('user/logout', async () => {
  userApi.clearAuthData();
});
