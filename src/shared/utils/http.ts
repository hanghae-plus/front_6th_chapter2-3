import { AxiosRequestConfig, isAxiosError } from "axios"
import { axiosInstance } from "./axios"

export const api = {
  get: async <T>(url: string, config?: AxiosRequestConfig) => {
    try {
      const response = await axiosInstance.get<T>(url, config)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },
  post: async <T>(url: string, data: unknown, config?: AxiosRequestConfig) => {
    try {
      const response = await axiosInstance.post<T>(url, data, config)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },
}

const handleApiError = (error: unknown) => {
  if (isAxiosError(error)) {
    return {
      message: error.message,
      code: error.code,
      status: error.status,
    }
  }
  if (error && typeof error === "object" && "response" in error && "message" in error && "code" in error) {
    return {
      message: error.message,
      status: error.response,
      code: error.code,
    }
  }
  return {
    message: "서버 API 통신시 오류가 발생됐습니다.",
    status: 500,
    code: "UNEXPECTED_ERROR",
  }
}
