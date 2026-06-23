import { Api } from '@shared/api';
import type { TOffer, TOfferCreate, TOfferUpdate } from './types';

const OFFERS_ENDPOINT = 'offers';

export class OffersApi extends Api {
  constructor() {
    super(OFFERS_ENDPOINT);
  }

  async getOffers(): Promise<TOffer[]> {
    try {
      return await this.get<TOffer[]>();
    } catch (error) {
      throw new Error(`Ошибка получения данных: ${error}`);
    }
  }

  async getOfferById(id: string): Promise<TOffer> {
    try {
      return await this.request(`${this.baseUrl}/${this.uri}/${id}`);
    } catch (error) {
      throw new Error(`Ошибка получения данных: ${error}`);
    }
  }

  async getOfferByUser(id: string): Promise<TOffer> {
    try {
      return await this.request(`${this.baseUrl}/${this.uri}/byUser/${id}`);
    } catch (error) {
      throw new Error(`Ошибка получения данных: ${error}`);
    }
  }

  async createOffer(userId: string, data: TOfferCreate): Promise<TOffer> {
    try {
      const newOffer = {
        userId,
        ...data,
        userLikedIds: [],
        createdAt: new Date().toISOString(),
      };
      return await this.request(`${this.baseUrl}/${this.uri}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOffer),
      });
    } catch (error) {
      throw new Error(`Ошибка добавления предложения: ${error}`);
    }
  }

  async offerDataUpdate(data: TOfferUpdate): Promise<TOffer> {
    try {
      return await this.patch(data, `${this.baseUrl}/${this.uri}/${data.id}`);
    } catch (error) {
      throw new Error(`Ошибка изменения данных предложения: ${error}`);
    }
  }

  async offerRemove(id: string): Promise<TOffer> {
    try {
      return await fetch(`${this.baseUrl}/${this.uri}/${id}`, {
        method: 'DELETE',
      }).then((response) => this.checkResponse<TOffer>(response));
    } catch (error) {
      throw new Error(`Ошибка удаления предложения ${id}: ${error}`);
    }
  }
}
