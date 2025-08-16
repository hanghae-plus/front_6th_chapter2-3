import { fetchUserProfiles } from "@/entities/User/api"
import { useQuery } from "@tanstack/react-query"

export function useQueryUsersProfile() {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUserProfiles(),
  })
}
