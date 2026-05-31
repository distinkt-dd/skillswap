import { Api } from '@shared/api';
import type { TCategory } from './types';

const CATEGORIES_ENDPOINT = 'categories';

export class CategoriesApi extends Api {
  constructor() {
    super(CATEGORIES_ENDPOINT);
  }

  async getCategories(): Promise<TCategory[]> {
    try {
      return this.get<TCategory[]>();
    } catch (error) {
      throw new Error(`Ошибка получения категорий: ${error}`);
    }
  }
}
