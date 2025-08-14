import { useQuery } from "@tanstack/react-query"
import { fetchUsers } from "./api"

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
    staleTime: Infinity, // 캐시 값을 유지하기 위해 staleTime을 Infinity로 설정합니다.
  })
}
