import { queryOptions } from "@tanstack/react-query"

import { userApi, FetchUsersParams } from "./api"

export const userQueries = {
  all: () => ["user"] as const,
  list: () => [...userQueries.all(), "list"] as const,
  listQuery: (params?: FetchUsersParams) =>
    queryOptions({
      queryKey: [...userQueries.list(), params],
      queryFn: () => userApi.getUsers(params),
    }),

  detail: () => [...userQueries.all(), "detail"] as const,
  detailQuery: (id: string) =>
    queryOptions({
      queryKey: [...userQueries.detail(), id],
      queryFn: () => userApi.getUser(parseInt(id)),
      enabled: !!id,
    }),
}
