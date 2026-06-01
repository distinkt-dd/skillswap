// slice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TUser } from '../api/types';
import { checkUserAuth, fetchUsers, login, logout, register, updateDateUser } from './actions';

type TUserInitialState = {
  user: TUser | null;
  users: TUser[];
  error: string | '';
  isResponse: boolean;
  isAuthChecked: boolean; // false = проверка идет, true = проверка завершена
};

const userInitialState: TUserInitialState = {
  user: null,
  users: [],
  error: '',
  isResponse: false,
  isAuthChecked: false, // Изначально false!
};

export const userSlice = createSlice({
  name: 'user',
  initialState: userInitialState,
  reducers: {
    setUser: (state, action: PayloadAction<TUser>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    setIsAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },
    clearUserError: (state) => {
      state.error = '';
    },
  },
  selectors: {
    selectedUser: (state) => state.user,
    selectedUsers: (state) => state.users,
    selectedUserIsAuthChecked: (state) => state.isAuthChecked,
    selectedUserIsResponse: (state) => state.isResponse,
    selectedUserError: (state) => state.error,
  },
  extraReducers: (builder) => {
    builder
      // --- Проверка авторизации ---
      .addCase(checkUserAuth.pending, (state) => {
        state.isAuthChecked = false;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      })

      // --- Логин и Регистрация ---
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.isResponse = false;
        state.error = '';
      })
      .addCase(login.pending, (state) => {
        state.isResponse = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.error.message as string;
        state.isResponse = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.isResponse = false;
      })
      .addCase(register.pending, (state) => {
        state.isResponse = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.error.message as string;
        state.isResponse = false;
      })

      // --- Остальное ---
      .addCase(updateDateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isResponse = false;
      })
      .addCase(updateDateUser.pending, (state) => {
        state.isResponse = true;
      })
      .addCase(updateDateUser.rejected, (state, action) => {
        state.error = action.error.message as string;
        state.isResponse = false;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.isResponse = false;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.isResponse = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      });
  },
});

export const { setUser, clearUser, setIsAuthChecked, clearUserError } = userSlice.actions;
export const {
  selectedUser,
  selectedUsers,
  selectedUserIsAuthChecked,
  selectedUserIsResponse,
  selectedUserError,
} = userSlice.selectors;
