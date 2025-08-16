import { fetchTags } from "@/entities/Tag/api"
import { useQuery } from "@tanstack/react-query"

export const useQueryTags = () => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: () => fetchTags(),
  })
}
