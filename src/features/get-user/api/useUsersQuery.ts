import type { UseQueryOptions } from "@tanstack/react-query"
import { useQuery } from "@tanstack/react-query"

import { fetchUsers } from "@/entities/user/api/users"
import type { FetchUsers } from "@/entities/user/model"

export function useUsersQuery(
  payload: FetchUsers.Payload = {},
  options: Omit<UseQueryOptions<FetchUsers.Response>, "queryKey" | "queryFn"> = {},
) {
  return useQuery({
    queryKey: ["users", payload],
    queryFn: () => fetchUsers(payload),
    ...options,
  })
}
