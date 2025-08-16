import type { AxiosRequestConfig, AxiosResponse, AxiosInstance } from "axios"
import { axiosInstance } from "@/shared/api/axios-client"

export interface HttpClientInterface {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>
  post<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T>
  put<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T>
  patch<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T>
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>
}

export const createHttpClient = (impl: AxiosInstance): HttpClientInterface => ({
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await impl.request({
        method: "get",
        url,
        ...config,
      })

      console.log("[DEBUG] response", response)

      return response.data
    } catch (error) {
      console.error(`HTTP request failed for ${url}:`, error)
      throw error
    }
  },

  async post<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await impl.request({
        method: "post",
        url,
        data,
        ...config,
      })

      console.log("[DEBUG] response", response)

      return response.data
    } catch (error) {
      console.error(`HTTP request failed for ${url}:`, error)
      throw error
    }
  },

  async put<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await impl.request({
        method: "put",
        url,
        data,
        ...config,
      })

      console.log("[DEBUG] response", response)

      return response.data
    } catch (error) {
      console.error(`HTTP request failed for ${url}:`, error)
      throw error
    }
  },

  async patch<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await impl.request({
        method: "patch",
        url,
        data,
        ...config,
      })

      console.log("[DEBUG] response", response)

      return response.data
    } catch (error) {
      console.error(`HTTP request failed for ${url}:`, error)
      throw error
    }
  },

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await impl.request({
        method: "delete",
        url,
        ...config,
      })

      console.log("[DEBUG] response", response)

      return response.data
    } catch (error) {
      console.error(`HTTP request failed for ${url}:`, error)
      throw error
    }
  },
})

export const httpClient = createHttpClient(axiosInstance)
