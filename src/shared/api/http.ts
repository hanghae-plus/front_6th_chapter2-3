import type { AxiosRequestConfig, AxiosResponse } from "axios"
import { axiosInstance } from "@/shared/api/axios-client"

export class HttpClient {
  private static async request<T, D = unknown>(
    method: "get" | "post" | "put" | "patch" | "delete",
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axiosInstance.request({
        method,
        url,
        data,
        ...config,
      })

      console.log("[DEBUG] response", response)

      return response.data
    } catch (error) {
      // 에러 처리를 위한 로직을 여기에 추가
      console.error(`HTTP request failed for ${url}:`, error)
      throw error
    }
  }

  // GET 요청
  static async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T, never>("get", url, undefined, config)
  }

  // POST 요청
  static async post<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T, D>("post", url, data, config)
  }

  // PUT 요청
  static async put<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T, D>("put", url, data, config)
  }

  // PATCH 요청
  static async patch<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T, D>("patch", url, data, config)
  }

  // DELETE 요청
  static async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T, never>("delete", url, undefined, config)
  }
}
