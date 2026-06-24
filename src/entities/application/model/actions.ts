// model/actions.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApplicationApi } from '../api/application';
import type {
  AcceptedOffer,
  Application,
  ReceivedApplication,
  RejectedApplication,
} from '../api/types';

const applicationApi = new ApplicationApi();

interface createApplicationI {
  offerId: string;
  userToId: string;
  offerToId: string;
}

// Создание заявки
export const createApplication = createAsyncThunk<
  Application,
  createApplicationI // offerId
>('application/create', async (payload: createApplicationI) => {
  return await applicationApi.createApplication(
    payload.offerId,
    payload.offerToId,
    payload.userToId
  );
});

// Получение принятых предложений
export const fetchAcceptedOffers = createAsyncThunk<AcceptedOffer[]>(
  'application/fetchAcceptedOffers',
  async () => {
    return await applicationApi.getAcceptedOffers();
  }
);

// Получение входящих заявок
export const fetchReceivedApplications = createAsyncThunk<ReceivedApplication[]>(
  'application/fetchReceivedApplications',
  async () => {
    return await applicationApi.getReceivedApplications();
  }
);

export const fetchRejectedApplications = createAsyncThunk<RejectedApplication[]>(
  'application/fetchRejectedApplication',
  async () => {
    return await applicationApi.getRejectedApplications();
  }
);

export const deleteApplications = createAsyncThunk<undefined, { appId: string }>(
  'application/delete',
  async ({ appId }) => {
    await applicationApi.deleteApplications(appId);
    return undefined;
  }
);

// Обновление статуса заявки
export const updateApplicationStatus = createAsyncThunk<
  Application,
  { applicationId: string; status: 'ACCEPTED' | 'REJECTED' }
>('application/updateStatus', async ({ applicationId, status }) => {
  return await applicationApi.updateApplicationStatus(applicationId, { status });
});
