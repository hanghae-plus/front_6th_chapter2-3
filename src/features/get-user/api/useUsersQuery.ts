import { useQuery } from "@tanstack/react-query"

import { fetchUsers } from "@/entities/user/api/users"
import type { FetchUsers } from "@/entities/user/model"

export function useUsersQuery(payload: FetchUsers.Payload = {}) {
  return useQuery({
    queryKey: ["users", payload],
    queryFn: () => fetchUsers(payload),
  })
}
