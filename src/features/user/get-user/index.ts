import { useQuery } from '@tanstack/react-query'
import { fetchUsers } from '@entities/user'

export function useBasicUsers() {
  return useQuery({
    queryKey: ['users', 'basic'],
    queryFn: () => fetchUsers({ limit: 0 }),
  })
}
