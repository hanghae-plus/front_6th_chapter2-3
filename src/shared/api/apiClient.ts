import axios, { AxiosRequestConfig, AxiosResponse } from "axios"

const API_BASE_URL = import.meta.env.PROD ? "https://dummyjson.com" : "/api"

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

export const apiClient = {
  delete: async <TResponse>(url: string, config?: AxiosRequestConfig) => {
    const response: AxiosResponse<TResponse> = await axiosInstance.delete(url, config)
    return response.data
  },

  get: async <TResponse>(url: string, config?: AxiosRequestConfig) => {
    const response: AxiosResponse<TResponse> = await axiosInstance.get(url, config)
    return response.data
  },

  patch: async <TResponse, TRequest = unknown>(url: string, data?: TRequest, config?: AxiosRequestConfig) => {
    const response: AxiosResponse<TResponse> = await axiosInstance.patch(url, data, config)
    return response.data
  },

  post: async <TResponse, TRequest = unknown>(url: string, data?: TRequest, config?: AxiosRequestConfig) => {
    const response: AxiosResponse<TResponse> = await axiosInstance.post(url, data, config)
    return response.data
  },

  put: async <TResponse, TRequest = unknown>(url: string, data?: TRequest, config?: AxiosRequestConfig) => {
    const response: AxiosResponse<TResponse> = await axiosInstance.put(url, data, config)
    return response.data
  },
}
