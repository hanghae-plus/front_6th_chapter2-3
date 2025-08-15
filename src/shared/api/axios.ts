import axios, { AxiosInstance, AxiosRequestConfig } from "axios"

const BASE_URL = "/api"

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  }
})

export type HttpConfig = AxiosRequestConfig;

axiosInstance.interceptors.request.use((config) => {
  return config
})

axiosInstance.interceptors.response.use(
  (response) => (response.data?.data ?? response.data),
  (error) => Promise.reject(error)
)

export const api = {
  get:    <T>(url: string, config?: HttpConfig): Promise<T> => axiosInstance.get(url, config),
  post:   <T>(url: string, data?: unknown, config?: HttpConfig): Promise<T> => axiosInstance.post(url, data, config),
  put:    <T>(url: string, data?: unknown, config?: HttpConfig): Promise<T> => axiosInstance.put(url, data, config),
  delete: <T>(url: string, config?: HttpConfig): Promise<T> => axiosInstance.delete(url, config),
  patch:  <T>(url: string, data?: unknown, config?: HttpConfig): Promise<T> => axiosInstance.patch(url, data, config),
};