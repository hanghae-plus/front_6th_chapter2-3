import { useQuery } from "@tanstack/react-query"
import { fetchUser, fetchUsers } from "./api"

const USER_QUERY_KEY = {
  LIST: "users",
}

/**
 * 사용자 목록 조회
 * @param limit - 페이지당 사용자 수
 * @param select - 선택할 필드
 * @returns 사용자 목록
 */
export const useUsersQuery = (limit: number, select: string) => {
  return useQuery({
    queryKey: [USER_QUERY_KEY.LIST, limit, select],
    queryFn: () => fetchUsers(limit, select),
  })
}

/**
 * 사용자 조회
 * @param id - 사용자 ID
 * @returns 사용자 정보
 */
export const useUserQuery = (id: number) => {
  return useQuery({
    queryKey: [USER_QUERY_KEY.LIST, id],
    queryFn: () => fetchUser(id),
  })
}
