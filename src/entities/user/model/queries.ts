import { useQuery } from "@tanstack/react-query"
import { getUsers, getUserById, getUsersWithFilters } from "@/entities/user/api"
import { USER_QUERY_KEYS } from "@/entities/user/model/query-key"

/**
 * 사용자 목록 조회 훅 (간단한 정보만)
 * @returns 사용자 목록 쿼리 객체
 */
export const useUsers = () => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.lists(),
    queryFn: getUsers,
    staleTime: 10 * 60 * 1000, // 10분
    gcTime: 20 * 60 * 1000, // 20분
  })
}

/**
 * 사용자 목록 조회 훅 (필터링, 페이지네이션 지원)
 * @param filters - 필터 옵션
 * @returns 사용자 목록 쿼리 객체
 */
export const useUsersWithFilters = (
  filters: {
    limit?: number
    skip?: number
    select?: string
  } = {},
) => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.list(filters),
    queryFn: () => getUsersWithFilters(filters),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 15 * 60 * 1000, // 15분
  })
}

/**
 * 단일 사용자 상세 정보 조회 훅
 * @param id - 사용자 ID
 * @param enabled - 쿼리 활성화 여부
 * @returns 사용자 상세 정보 쿼리 객체
 */
export const useUser = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.detail(id),
    queryFn: () => getUserById(id),
    enabled: enabled && !!id,
    staleTime: 15 * 60 * 1000, // 15분
    gcTime: 30 * 60 * 1000, // 30분
  })
}
