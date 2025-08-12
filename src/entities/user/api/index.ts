import { HttpClient } from "@/shared/api/http"
import { User, Author } from "../model/schema"

export const userApi = {
  // 사용자 목록 조회 (간단한 정보만)
  async getUsers(): Promise<{ users: Author[] }> {
    return HttpClient.get<{ users: Author[] }>("/users?limit=0&select=username,image")
  },

  // 단일 사용자 상세 정보 조회
  async getUserById(id: number): Promise<User> {
    return HttpClient.get<User>(`/users/${id}`)
  },
}
