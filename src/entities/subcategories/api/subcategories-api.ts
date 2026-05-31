import { Api } from '@shared/api';
import type { TSubCategory } from './types';

const SUBCATEGORIES_ENDPOINT = 'subcategories';

export class SubCategoriesApi extends Api {
  constructor() {
    super(SUBCATEGORIES_ENDPOINT);
  }

  async getSubCategories(): Promise<TSubCategory[]> {
    try {
      return this.get<TSubCategory[]>();
    } catch (error) {
      throw new Error(`Ошибка получения подкатегорий: ${error}`);
    }
  }
}
