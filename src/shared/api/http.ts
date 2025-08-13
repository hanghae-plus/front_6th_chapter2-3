/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosRequestConfig, AxiosResponse } from "axios"
import { axiosClient } from "@/shared/api/axios-client"
import { ApiResponse, PaginatedResponse } from "@/shared/api/type"

export class HttpClient {
  private static async request<T>(
    method: "get" | "post" | "put" | "patch" | "delete",
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await axiosClient.request({
        method,
        url,
        data,
        ...config,
      })

      // data 필드가 없는 경우 (예: DELETE 요청의 성공 응답)
      // 이 경우 T가 void일 수 있습니다.
      return response.data as T
    } catch (error) {
      // 에러 처리를 위한 로직을 여기에 추가
      console.error(`HTTP request failed for ${url}:`, error)
      throw error
    }
  }

  // GET 요청
  static async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>("get", url, undefined, config)
  }

  // POST 요청
  static async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>("post", url, data, config)
  }

  // PUT 요청
  static async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>("put", url, data, config)
  }

  // PATCH 요청
  static async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>("patch", url, data, config)
  }

  // DELETE 요청 (반환 타입을 void로 가정)
  static async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>("delete", url, undefined, config)
  }

  // 페이지네이션 GET 요청
  static async getPaginated<T>(url: string, config?: AxiosRequestConfig): Promise<PaginatedResponse & { data: T[] }> {
    return this.request<PaginatedResponse & { data: T[] }>("get", url, undefined, config)
  }
}
