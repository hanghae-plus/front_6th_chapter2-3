import { useQuery } from '@tanstack/react-query'
import { fetchUsers, fetchUser } from './index'

// 사용자 목록 조회 (포스트 작성자 정보용)
export const useGetUsers = (params?: string) => {
  return useQuery({
    queryKey: ['users', 'list', { params }],
    queryFn: () => fetchUsers(params),
  })
}

// 개별 사용자 상세 조회 (모달용)
export const useGetUser = (id: number) => {
  return useQuery({
    queryKey: ['users', 'detail', id],
    queryFn: () => fetchUser(id),
    enabled: !!id, // id가 있을 때만 실행
  })
}