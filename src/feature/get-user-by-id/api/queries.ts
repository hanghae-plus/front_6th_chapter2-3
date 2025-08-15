import { useQuery } from "@tanstack/react-query"

import { userApi } from "@/entities/user"

export const useGetUserById = (userId?: number) => {
  return useQuery({
    enabled: !!userId,
    queryFn: () => userApi.getById(userId!),
    queryKey: ["users", userId],
  })
}
