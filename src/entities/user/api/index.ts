import { httpClient } from "@/shared/api/http"
import { User, UserPaginatedResponse } from "../model"

// 사용자 목록 조회
export const getUsers = async (): Promise<UserPaginatedResponse> => {
  return httpClient.get<UserPaginatedResponse>("/users?limit=0&select=username,image")
}

// 단일 사용자 상세 정보 조회
export const getUserById = async (id: number): Promise<User> => {
  return httpClient.get<User>(`/users/${id}`)
}
