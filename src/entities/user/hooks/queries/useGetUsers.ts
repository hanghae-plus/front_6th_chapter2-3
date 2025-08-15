import { USER_QUERY_KEY } from "@entities/user/const"
import { User } from "@entities/user/types"
import { http } from "@shared/lib/api/http"
import { useQuery } from "@tanstack/react-query"

interface GetUsersRequestParams {
  limit?: number
  select?: string
}

interface GetUsersResponse {
  limit: number
  skip: number
  total: number
  users: User[]
}

export const getUsers = async (params?: GetUsersRequestParams) => {
  const response = await http.get<GetUsersResponse>("/users", {
    params,
  })

  return response
}

export const useGetUsers = (params?: GetUsersRequestParams) => {
  return useQuery({
    queryKey: USER_QUERY_KEY.list([params]),
    queryFn: () => getUsers(params),
  })
}
