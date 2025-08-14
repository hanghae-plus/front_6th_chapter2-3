import { useQuery } from "@tanstack/react-query"
import { USER_QUERY_KEYS } from "@/entities/user/model/query-key"
import { getUserById } from "@/entities/user/api"

export const useUserProfile = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.detail(id),
    queryFn: () => getUserById(id),
    enabled: enabled && !!id,
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}
