import { useQuery } from "@tanstack/react-query"
import { getUsers, getUserById } from "@/entities/user/api"
import { USER_QUERY_KEYS } from "@/entities/user/model/query-key"

export const useUsers = () => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.lists(),
    queryFn: getUsers,
    staleTime: 10 * 60 * 1000, // 10분
    gcTime: 20 * 60 * 1000, // 20분
  })
}

export const useUser = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.detail(id),
    queryFn: () => getUserById(id),
    enabled: enabled && !!id,
    staleTime: 15 * 60 * 1000, // 15분
    gcTime: 30 * 60 * 1000, // 30분
  })
}
