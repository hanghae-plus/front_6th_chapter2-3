import { HttpClient } from "@/shared/api/http"
import { User, Author } from "../model/types"

// 사용자 목록 조회 (간단한 정보만)
export const getUsers = async (): Promise<{ users: Author[] }> => {
  return HttpClient.get<{ users: Author[] }>("/users?limit=0&select=username,image")
}

// 단일 사용자 상세 정보 조회
export const getUserById = async (id: number): Promise<User> => {
  return HttpClient.get<User>(`/users/${id}`)
}

// 사용자 목록 조회 (페이지네이션, 필터링 지원)
export const getUsersWithFilters = async (
  filters: {
    limit?: number
    skip?: number
    select?: string
  } = {},
): Promise<{ users: User[]; total: number }> => {
  const params = new URLSearchParams()

  if (filters.limit) params.set("limit", filters.limit.toString())
  if (filters.skip) params.set("skip", filters.skip.toString())
  if (filters.select) params.set("select", filters.select)

  const url = `/users${params.toString() ? `?${params.toString()}` : ""}`
  return HttpClient.get<{ users: User[]; total: number }>(url)
}
