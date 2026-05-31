// shared/api.ts
export class Api {
  readonly baseUrl: string = import.meta.env.VITE_SKILLSWAP_API_URL;
  readonly uri: string;
  private static token: string | null = null;

  constructor(uri: string) {
    this.uri = uri;
  }

  // Установка токена для всех экземпляров
  static setToken(token: string | null) {
    Api.token = token;
  }

  protected getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (Api.token) {
      headers['Authorization'] = `Bearer ${Api.token}`;
    }
    return headers;
  }

  protected async request<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...(options?.headers || {}),
      },
    });
    return this.checkResponse<T>(response);
  }

  protected checkResponse = async <T>(res: Response): Promise<T> => {
    if (res.ok) {
      // если статус 204 (No Content) — вернуть пустой объект или null
      if (res.status === 204) {
        return {} as T;
      }
      return res.json();
    }

    const text = await res.text();
    let errorMessage = `Ошибка ${res.status}: ${res.statusText}`;

    try {
      const errorJson = JSON.parse(text);
      errorMessage = errorJson.message || errorJson.error || errorMessage;
    } catch {
      if (text) {
        errorMessage = `${errorMessage} - ${text}`;
      }
    }

    throw new Error(errorMessage);
  };

  // Методы для GET, POST, PATCH, DELETE с автоматической подстановкой заголовков
  protected async get<TResponse>(customUrl?: string): Promise<TResponse> {
    const url = customUrl || `${this.baseUrl}/${this.uri}`;
    return this.request<TResponse>(url, { method: 'GET' });
  }

  protected async post<TResponse, TBody = any>(
    body: TBody,
    customUrl?: string
  ): Promise<TResponse> {
    const url = customUrl || `${this.baseUrl}/${this.uri}`;
    return this.request<TResponse>(url, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  protected async patch<TResponse, TBody = any>(
    body: TBody,
    customUrl?: string
  ): Promise<TResponse> {
    const url = customUrl || `${this.baseUrl}/${this.uri}`;
    return this.request<TResponse>(url, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  protected async delete<TResponse>(customUrl?: string): Promise<TResponse> {
    const url = customUrl || `${this.baseUrl}/${this.uri}`;
    return this.request<TResponse>(url, { method: 'DELETE' });
  }
}
