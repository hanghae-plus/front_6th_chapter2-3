import { api } from "../../shared/api/api"
import { ListResponse } from "../../shared/types/types"
import { DetailUser, User } from "./model"

/**
 * 사용자 목록 조회
 * @param limit - 페이지당 사용자 수
 * @param select - 선택할 필드
 * @returns 사용자 목록
 */
export const fetchUsers = async (limit: number, select: string) => {
  const response = await api.get<ListResponse<"users", Pick<User, "id" | "username" | "image">>>(
    `/users?limit=${limit}&select=${select}`,
  )

  return response
}

export const fetchUser = async (id: number) => {
  const response = await api.get<DetailUser>(`/users/${id}`)
  return response
}
