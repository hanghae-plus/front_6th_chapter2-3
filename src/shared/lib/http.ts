import { AxiosRequestConfig } from "axios"

import { api } from "@/shared/lib/api"

export const http = {
  get: async <Response = unknown>(url: string, options: AxiosRequestConfig = {}) => {
    const response = await api.get<Response>(url, options)
    return response.data
  },
  post: async <Request = unknown, Response = unknown>(url: string, data?: Request, options?: AxiosRequestConfig) => {
    const response = await api.post<Response>(url, data, options)
    return response.data
  },
  put: async <Request = unknown, Response = unknown>(url: string, data?: Request) => {
    const response = await api.put<Response>(url, data)
    return response.data
  },
  del: async <Response = unknown>(url: string) => {
    const response = await api.delete<Response>(url)
    return response.data
  },
  patch: async <Response = unknown, Request = unknown>(url: string, data?: Request) => {
    const response = await api.patch<Response>(url, data)
    return response.data
  },
  download: async <Response = Blob>(url: string) => {
    const response = await api.get<Response>(url, { responseType: "blob" })
    return response.data
  },
}
