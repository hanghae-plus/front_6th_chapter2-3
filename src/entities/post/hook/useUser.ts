import { useQuery } from "@tanstack/react-query"

import { userApi } from "@/entities/post/api/userApi"

import { queryKeys } from "../lib/queryKeys"

export const useGetUser = (userId: number) => {
  return useQuery({
    queryKey: queryKeys.users.user(userId),
    queryFn: () => userApi.getUser(userId),
    enabled: !!userId,
  })
}
