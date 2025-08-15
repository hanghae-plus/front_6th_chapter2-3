import { useQuery } from '@tanstack/react-query'
import { userApi } from '../api'
import { UsersResponse, User } from './types'

// 사용자 목록 조회
export const useUsers = (limit: number = 0, select?: string) => {
  return useQuery<UsersResponse>({
    queryKey: ['users', 'list', limit, select],
    queryFn: () => userApi.getUsers(limit, select),
  })
}

// 단일 사용자 조회
export const useUser = (id: number) => {
  return useQuery<User>({
    queryKey: ['users', 'detail', id],
    queryFn: () => userApi.getUser(id),
    enabled: !!id,
  })
}
