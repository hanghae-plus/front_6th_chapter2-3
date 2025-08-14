import { useQuery } from "@tanstack/react-query"
import { getUsers, getUserById } from "@/entities/user/api"
import { USER_QUERY_KEYS } from "@/entities/user/model/query-key"

export const useUsers = () => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.lists(),
    queryFn: getUsers,
  })
}

export const useUser = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.detail(id),
    queryFn: () => getUserById(id),
    enabled: enabled && !!id,
  })
}
