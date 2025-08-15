const API_BASE_URL = import.meta.env.DEV ? '/api' : 'https://dummyjson.com';

export interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

export class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private buildURL(endpoint: string, params?: Record<string, string | number | boolean>): string {
    const fullPath = this.baseURL + endpoint;
    const url = new URL(fullPath, window.location.origin);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const { params, ...fetchConfig } = config;
    const url = this.buildURL(endpoint, params);

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...fetchConfig.headers,
      },
      ...fetchConfig,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  async post<T>(
    endpoint: string,
    data?: any,
    params?: Record<string, string | number | boolean>,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      params,
    });
  }

  async put<T>(
    endpoint: string,
    data?: any,
    params?: Record<string, string | number | boolean>,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      params,
    });
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    params?: Record<string, string | number | boolean>,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      params,
    });
  }

  async delete<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean>,
  ): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', params });
  }
}

export const client = new ApiClient();
