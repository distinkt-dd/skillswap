// api/user.ts
import { Api } from '@shared/api';
import type {
  TAuthResponse,
  TLoginUser,
  TRegisterUser,
  TUpdateUser,
  TUpdateUserPass,
  TUser,
} from './types';

const USER_ENDPOINT = 'users';
const TOKEN_STORAGE_KEY = 'token';

export class UserApi extends Api {
  constructor() {
    super(USER_ENDPOINT);
  }

  // Сохраняем ТОЛЬКО токен
  private saveToken(token: string): void {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    Api.setToken(token);
  }

  public clearAuthData(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    Api.setToken(null);
  }

  // Теперь эта функция только инициализирует токен в Api классе
  public initToken(): void {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      Api.setToken(token);
    }
  }

  // НОВЫЙ МЕТОД: проверка авторизации через бекенд
  async checkMe(): Promise<TAuthResponse | null> {
    try {
      // Вызываем /users/checkme
      this.initToken();
      const response = await this.get<TAuthResponse>(`${this.baseUrl}/${USER_ENDPOINT}/checkme`);
      this.saveToken(response.token); // Обновляем токен (если бекенд прислал новый)
      return response;
    } catch (error) {
      this.clearAuthData();
      return null;
    }
  }

  async getUsers(): Promise<TUser[]> {
    return this.get<TUser[]>();
  }

  async getUserById(id: string): Promise<TUser> {
    return this.get<TUser>(`${this.baseUrl}/${USER_ENDPOINT}/${id}`);
  }

  async userLogin(data: TLoginUser): Promise<TUser> {
    const response = await this.post<TAuthResponse, TLoginUser>(
      data,
      `${this.baseUrl}/${USER_ENDPOINT}/login`
    );
    this.saveToken(response.token);
    return response.user;
  }

  async userRegister(data: TRegisterUser): Promise<TUser> {
    const response = await this.post<TAuthResponse, TRegisterUser>(
      data,
      `${this.baseUrl}/${USER_ENDPOINT}/register`
    );
    this.saveToken(response.token);
    return response.user;
  }

  async userPassUpdate(data: TUpdateUserPass): Promise<void> {
    await this.patch<void, { newPassword: string }>(
      { newPassword: data.password },
      `${this.baseUrl}/${USER_ENDPOINT}/${data.id}/password`
    );
  }

  async userDataUpdate(data: TUpdateUser): Promise<TUser> {
    return await this.patch<TUser, TUpdateUser>(
      data,
      `${this.baseUrl}/${USER_ENDPOINT}/${data.id}`
    );
  }

  async userRemove(id: string): Promise<void> {
    await this.delete<void>(`${this.baseUrl}/${USER_ENDPOINT}/${id}`);
    this.clearAuthData();
  }
}
