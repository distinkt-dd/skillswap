import { Api } from '@shared/api';

const FAVORITES_ENDPOINT = 'favorites';

export class FavoritesApi extends Api {
  constructor() {
    super(FAVORITES_ENDPOINT);
  }

  async getFavorites(): Promise<string[]> {
    try {
      return this.get<string[]>();
    } catch (error) {
      throw new Error(`Ошибка получения избранного: ${error}`);
    }
  }

  async addFavorite(userId: string): Promise<string[]> {
    try {
      // Получаем текущий список избранного
      const currentFavorites = await this.getFavorites();

      // Добавляем новый ID, если его еще нет
      if (!currentFavorites.includes(userId)) {
        const updatedFavorites = [...currentFavorites, userId];

        // Отправляем обновленный список
        const response = await fetch(`${this.baseUrl}/${this.uri}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedFavorites),
        });

        return await this.checkResponse<string[]>(response);
      }

      return currentFavorites;
    } catch (err) {
      throw new Error(`Ошибка добавления пользователя в избранное: ${err}`);
    }
  }

  async deleteFavorite(userId: string): Promise<string[]> {
    try {
      // Получаем текущий список избранного
      const currentFavorites = await this.getFavorites();

      // Удаляем ID из массива
      const updatedFavorites = currentFavorites.filter((id) => id !== userId);

      // Отправляем обновленный список
      const response = await fetch(`${this.baseUrl}/${this.uri}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFavorites),
      });

      return await this.checkResponse<string[]>(response);
    } catch (err) {
      throw new Error(`Ошибка удаления пользователя из избранного: ${err}`);
    }
  }
}
