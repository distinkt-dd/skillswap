// model/slice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { AcceptedOffer, Application, ReceivedApplication } from '../api/types';
import {
  createApplication,
  fetchAcceptedOffers,
  fetchReceivedApplications,
  updateApplicationStatus,
} from './actions';

type ApplicationState = {
  receivedApplications: ReceivedApplication[];
  acceptedOffers: AcceptedOffer[];
  currentApplication: Application | null; // последняя созданная/обновлённая
  loading: boolean;
  error: string | null;
};

const initialState: ApplicationState = {
  receivedApplications: [],
  acceptedOffers: [],
  currentApplication: null,
  loading: false,
  error: null,
};

export const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    clearApplicationError: (state) => {
      state.error = null;
    },
    clearCurrentApplication: (state) => {
      state.currentApplication = null;
    },
    // Можно добавить сброс всех данных
    resetApplicationState: () => initialState,
  },
  selectors: {
    selectReceivedApplications: (state) => state.receivedApplications,
    selectAcceptedOffers: (state) => state.acceptedOffers,
    selectCurrentApplication: (state) => state.currentApplication,
    selectApplicationLoading: (state) => state.loading,
    selectApplicationError: (state) => state.error,
  },
  extraReducers: (builder) => {
    builder
      // --- createApplication ---
      .addCase(createApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.currentApplication = action.payload;
      })
      .addCase(createApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка создания заявки';
      })

      // --- fetchAcceptedOffers ---
      .addCase(fetchAcceptedOffers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAcceptedOffers.fulfilled, (state, action) => {
        state.loading = false;
        state.acceptedOffers = action.payload;
      })
      .addCase(fetchAcceptedOffers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка получения принятых предложений';
      })

      // --- fetchReceivedApplications ---
      .addCase(fetchReceivedApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReceivedApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.receivedApplications = action.payload;
      })
      .addCase(fetchReceivedApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка получения входящих заявок';
      })

      // --- updateApplicationStatus ---
      .addCase(updateApplicationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.currentApplication = action.payload;
        // Обновляем статус в списке receivedApplications, если он там есть
        const updated = action.payload;
        const index = state.receivedApplications.findIndex((app) => app.id === updated.id);
        if (index !== -1) {
          // Можно заменить на обновлённую, но структура отличается, поэтому либо удаляем, либо преобразуем
          // Проще удалить из списка, так как после обработки она уже не PENDING
          state.receivedApplications.splice(index, 1);
        }
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка обновления статуса заявки';
      });
  },
});

export const { clearApplicationError, clearCurrentApplication, resetApplicationState } =
  applicationSlice.actions;

export const {
  selectReceivedApplications,
  selectAcceptedOffers,
  selectCurrentApplication,
  selectApplicationLoading,
  selectApplicationError,
} = applicationSlice.selectors;
