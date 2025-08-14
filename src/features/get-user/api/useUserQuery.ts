import { useQuery } from "@tanstack/react-query"

import { fetchUserById } from "@/entities/user/api/users"
import type { FetchUserById } from "@/entities/user/model"

export function useUserQuery(payload: FetchUserById.Payload) {
  return useQuery({
    queryKey: ["users", payload],
    queryFn: () => fetchUserById(payload),
    enabled: !!payload.id,
  })
}
