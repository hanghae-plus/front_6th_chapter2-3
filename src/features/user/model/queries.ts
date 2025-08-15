import { useQuery } from "@tanstack/react-query"
import { getUserInfo } from "../../../entities/users"
import type { UserInfo } from "../../../entities/users/api/types"

export const userKeys = {
  all: ["users"] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (userId: number) => [...userKeys.details(), userId] as const,
}

export const useUserInfoQuery = (userId: number | null) => {
  return useQuery({
    queryKey: userKeys.detail(userId!),
    queryFn: async () => {
      const response = await getUserInfo(userId!)
      return response.data as UserInfo
    },
    enabled: !!userId,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  })
}
