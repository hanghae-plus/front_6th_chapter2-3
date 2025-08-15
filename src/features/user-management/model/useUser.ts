import { useQuery } from "@tanstack/react-query"
import { fetchUserApi } from "../../../entities/users/api"

export const useUser = (userId: number | null) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUserApi(userId!),
    enabled: !!userId,
  })
}
