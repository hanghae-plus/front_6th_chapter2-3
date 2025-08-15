import { USER_QUERY_KEY } from "@entities/user/const"
import { User } from "@entities/user/types"
import { http } from "@shared/lib/api/http"
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
