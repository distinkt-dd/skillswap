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
const USER_STORAGE_KEY = 'user';
const TOKEN_STORAGE_KEY = 'token';

export class UserApi extends Api {
  constructor() {
    super(USER_ENDPOINT);
  }

  // Сохранение пользователя и токена в localStorage
  private saveAuthData(user: TUser, token: string): void {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    Api.setToken(token);
  }

  // Очистка данных при выходе
  public clearAuthData(): void {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    Api.setToken(null);
  }

  // Загрузка пользователя из хранилища при старте
  getUserFromStorage(): TUser | null {
    const rawUser = localStorage.getItem(USER_STORAGE_KEY);
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!rawUser || !token) {
      return null;
    }
    try {
      Api.setToken(token);
      return JSON.parse(rawUser) as TUser;
    } catch {
      this.clearAuthData();
      return null;
    }
  }

  // Получение всех пользователей (только публичные данные)
  async getUsers(): Promise<TUser[]> {
    return this.get<TUser[]>();
  }

  async getUserById(id: string): Promise<TUser> {
    return this.get<TUser>(`${this.baseUrl}/${USER_ENDPOINT}/${this.uri}/${id}`);
  }

  // Логин
  async userLogin(data: TLoginUser): Promise<TUser> {
    try {
      const response = await this.post<TAuthResponse, TLoginUser>(
        data,
        `${this.baseUrl}/${USER_ENDPOINT}/login`
      );
      this.saveAuthData(response.user, response.token);
      return response.user;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          throw new Error('Неверный email или пароль');
        }
      }
      throw new Error('Ошибка при входе в систему');
    }
  }

  // Регистрация
  async userRegister(data: TRegisterUser): Promise<TUser> {
    try {
      const response = await this.post<TAuthResponse, TRegisterUser>(
        data,
        `${this.baseUrl}/${USER_ENDPOINT}/register`
      );
      this.saveAuthData(response.user, response.token);
      return response.user;
    } catch (error) {
      if (error instanceof Error && error.message.includes('User already exists')) {
        throw new Error('Пользователь с таким email уже существует');
      }
      throw new Error(`Ошибка регистрации: ${error}`);
    }
  }

  // Обновление пароля (отправляем plain newPassword)
  async userPassUpdate(data: TUpdateUserPass): Promise<void> {
    await this.patch<void, { newPassword: string }>(
      { newPassword: data.password },
      `${this.baseUrl}/${USER_ENDPOINT}/${this.uri}/${data.id}/password`
    );
  }

  // Обновление данных пользователя
  async userDataUpdate(data: TUpdateUser): Promise<TUser> {
    const updated = await this.patch<TUser, TUpdateUser>(
      data,
      `${this.baseUrl}/${this.uri}/${data.id}`
    );
    // Обновляем сохранённого пользователя в localStorage
    const currentUser = this.getUserFromStorage();
    if (currentUser && currentUser.id === updated.id) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
    }
    return updated;
  }

  // Удаление пользователя
  async userRemove(id: string): Promise<void> {
    await this.delete<void>(`${this.baseUrl}/${this.uri}/${id}`);
    this.clearAuthData();
  }
}
