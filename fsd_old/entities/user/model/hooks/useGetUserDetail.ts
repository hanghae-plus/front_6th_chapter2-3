import { USER_QUERY_KEY } from "@entities/user/model/keys"
import { User } from "@entities/user/model/types"
import { http } from "@shared/api"
import { useQuery, UseQueryOptions } from "@tanstack/react-query"

const getUserDetail = async (id: number) => {
  const response = await http.get<User>(`/users/${id}`)

  return response
}

export const useGetUserDetail = (id: number, options?: Omit<UseQueryOptions<User, Error>, "queryKey" | "queryFn">) => {
  return useQuery({
    queryKey: USER_QUERY_KEY.detail([id]),
    queryFn: () => getUserDetail(id),
    ...options,
  })
}
