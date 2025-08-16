import { useQuery2 } from "../../../shared/createQuery.ts"
import { UserResponse } from "../User.ts"

export const useQueryUsers = (limit: number, skip: number | null, select: string) => {
  return useQuery2<UserResponse>(["/api/users", { limit, skip, select }], {
    placeholderData: { users: [], total: 0 },
  })
}
