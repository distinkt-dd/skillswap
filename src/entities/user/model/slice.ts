// slice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TUser } from '../api/types';
import { fetchUsers, login, logout, register, updateDateUser, updatePassword } from './actions';

type TUserInitialState = {
  user: TUser | null;
  users: TUser[];
  error: string | '';
  isResponse: boolean;
  isAuthChecked: boolean;
};

const userInitialState: TUserInitialState = {
  user: null,
  users: [],
  error: '',
  isResponse: false,
  isAuthChecked: true,
};

export const userSlice = createSlice({
  name: 'user',
  initialState: userInitialState,
  reducers: {
    setUser: (state, action: PayloadAction<TUser>) => {
      state.user = action.payload;
      state.isAuthChecked = true;
    },
    clearUser: (state) => {
      state.user = null;
      // Очистка вынесена в api, но дублируем локально
      localStorage.removeItem('user');
      localStorage.removeItem('token');
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
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.isResponse = false;
        state.error = '';
      })
      .addCase(login.pending, (state) => {
        state.isResponse = true;
        state.error = '';
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.error.message as string;
        state.isResponse = false;
        state.isAuthChecked = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.isResponse = false;
        state.error = '';
      })
      .addCase(register.pending, (state) => {
        state.isResponse = true;
        state.error = '';
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.error.message as string;
        state.isResponse = false;
        state.isAuthChecked = true;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.isResponse = false;
        state.error = '';
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.isResponse = false;
        state.error = action.error.message as string;
      })
      .addCase(updatePassword.pending, (state) => {
        state.isResponse = true;
      })
      .addCase(updateDateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.isResponse = false;
        state.error = '';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.isResponse = false;
        state.error = '';
      })
      .addCase(fetchUsers.pending, (state) => {
        state.isResponse = true;
        state.error = '';
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.error = action.error.message as string;
        state.isResponse = false;
      })
      .addCase(updateDateUser.pending, (state) => {
        state.isResponse = true;
        state.error = '';
      })
      .addCase(updateDateUser.rejected, (state, action) => {
        state.error = action.error.message as string;
        state.isResponse = false;
        state.isAuthChecked = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = true;
        state.error = '';
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
