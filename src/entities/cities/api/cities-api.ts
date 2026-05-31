import { Api } from '@shared/api';
import type { TCity } from './types';

const CITIES_ENDPOINT = 'cities';

export class CitiesApi extends Api {
  constructor() {
    super(CITIES_ENDPOINT);
  }

  async getCities(): Promise<TCity[]> {
    try {
      return this.get<TCity[]>();
    } catch (error) {
      throw new Error(`Ошибка получения городов: ${error}`);
    }
  }
}
