import { useQuery } from "@tanstack/react-query"
import { getTags } from "../api/postsApis"
import { QUERY_KEYS } from "@/shared"

export const useTagActions = () => {
  const { data: tags = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.TAGS.all,
    queryFn: getTags,
  })

  return {
    tags,
    isLoading,
  }
}
