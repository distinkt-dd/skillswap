// api/application.ts
import { Api } from '@shared/api';
import type {
  AcceptedOffer,
  Application,
  ReceivedApplication,
  UpdateApplicationStatusPayload,
} from './types';

const APPLICATION_ENDPOINT = 'applications';

export class ApplicationApi extends Api {
  constructor() {
    super(APPLICATION_ENDPOINT);
  }

  // POST /applications/:offerId
  async createApplication(offerId: string, userToId: string): Promise<Application> {
    return this.post<Application, never>(
      undefined, // тело пустое
      `${this.baseUrl}/${APPLICATION_ENDPOINT}/${offerId}/${userToId}`
    );
  }

  // GET /applications/accepted-offers
  async getAcceptedOffers(): Promise<AcceptedOffer[]> {
    return this.get<AcceptedOffer[]>(`${this.baseUrl}/${APPLICATION_ENDPOINT}/accepted-offers`);
  }

  // GET /applications/received-applications
  async getReceivedApplications(): Promise<ReceivedApplication[]> {
    return this.get<ReceivedApplication[]>(
      `${this.baseUrl}/${APPLICATION_ENDPOINT}/received-applications`
    );
  }

  // PATCH /applications/:applicationId
  async updateApplicationStatus(
    applicationId: string,
    payload: UpdateApplicationStatusPayload
  ): Promise<Application> {
    return this.patch<Application, UpdateApplicationStatusPayload>(
      payload,
      `${this.baseUrl}/${APPLICATION_ENDPOINT}/${applicationId}`
    );
  }
}
