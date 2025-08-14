import { useQuery } from "@tanstack/react-query"
import { getTags } from "@/entities/tag/api"
import { TAG_QUERY_KEYS } from "@/entities/tag/model/query-key"

export const useTags = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: TAG_QUERY_KEYS.lists(),
    queryFn: () => getTags(),
  })

  return { data, isLoading, error }
}
