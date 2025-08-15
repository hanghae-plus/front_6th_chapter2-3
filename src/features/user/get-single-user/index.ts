import { useQuery } from '@tanstack/react-query'
import { IUserDetail } from '@entities/user'
import { http } from '@shared/lib/http-client'

export const useUserQuery = (userId: number, options: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => http.get<IUserDetail>(`/users/${userId}`),
    enabled: options.enabled !== false && !!userId,
  })
}
