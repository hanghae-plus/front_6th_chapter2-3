import { useQuery } from "@tanstack/react-query"

import { fetchUserById } from "@/entities/user/api/users"
import { userKeys } from "@/entities/user/lib"
import type { FetchUserById } from "@/entities/user/model"

export function useUserQuery(payload: FetchUserById.Payload) {
  return useQuery({
    queryKey: userKeys.detail(payload),
    queryFn: () => fetchUserById(payload),
    enabled: !!payload.id,
  })
}
