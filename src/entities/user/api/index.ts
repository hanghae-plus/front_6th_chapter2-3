import { HttpClient } from "@/shared/api/http"
import { User, UserPaginatedResponse } from "../model"

// 사용자 목록 조회 (간단한 정보만)
export const getUsers = async (): Promise<UserPaginatedResponse> => {
  return HttpClient.get<UserPaginatedResponse>("/users?limit=0&select=username,image")
}

// 단일 사용자 상세 정보 조회
export const getUserById = async (id: number): Promise<User> => {
  return HttpClient.get<User>(`/users/${id}`)
}
