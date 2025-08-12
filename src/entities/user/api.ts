import { api } from "../../shared/api/api"
import { User } from "./model"

/**
 * 사용자 목록 조회
 * @param limit - 페이지당 사용자 수
 * @param select - 선택할 필드
 * @returns 사용자 목록
 */
export const fetchUsers = async (limit: number, select: string) => {
  const response = await api.get<Pick<User, "id" | "username" | "image">[]>(`/users?limit=${limit}&select=${select}`)
  return response
}
