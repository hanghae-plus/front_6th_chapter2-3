import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

const API_BASE_URL = process.env.NODE_ENV === 'development' ? '/api' : 'https://dummyjson.com'

class HttpClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      withCredentials: false,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config)
    return response.data
  }

  async post<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.post<T>(url, data)
    return response.data
  }

  async put<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.put<T>(url, data)
    return response.data
  }

  async patch<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.patch<T>(url, data)
    return response.data
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url)
    return response.data
  }
}

const httpClient = new HttpClient()

export const http = {
  get: <T>(url: string, config?: AxiosRequestConfig) => httpClient.get<T>(url, config),
  post: <T>(url: string, data?: unknown) => httpClient.post<T>(url, data),
  put: <T>(url: string, data?: unknown) => httpClient.put<T>(url, data),
  patch: <T>(url: string, data?: unknown) => httpClient.patch<T>(url, data),
  delete: <T>(url: string) => httpClient.delete<T>(url),
}
