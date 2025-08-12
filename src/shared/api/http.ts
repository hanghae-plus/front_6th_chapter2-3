/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosClient } from "@/shared/api/axios-client"
import { ApiResponse, PaginatedResponse } from "@/shared/api/type"

export class HttpClient {
  // GET 요청
  static async get<T>(url: string, config?: any): Promise<T> {
    const response = await axiosClient.get<ApiResponse<T>>(url, config)
    return response.data.data
  }

  // POST 요청
  static async post<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await axiosClient.post<ApiResponse<T>>(url, data, config)
    return response.data.data
  }

  // PUT 요청
  static async put<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await axiosClient.put<ApiResponse<T>>(url, data, config)
    return response.data.data
  }

  // PATCH 요청
  static async patch<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await axiosClient.patch<ApiResponse<T>>(url, data, config)
    return response.data.data
  }

  // DELETE 요청
  static async delete<T>(url: string, config?: any): Promise<T> {
    const response = await axiosClient.delete<ApiResponse<T>>(url, config)
    return response.data.data
  }

  // 페이지네이션 GET 요청
  static async getPaginated<T>(url: string, config?: any): Promise<PaginatedResponse<T>> {
    const response = await axiosClient.get<ApiResponse<PaginatedResponse<T>>>(url, config)
    return response.data.data
  }
}

const httpClient = new HttpClient()
export default httpClient
