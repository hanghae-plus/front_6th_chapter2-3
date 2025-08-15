import { TAGS_QUERY_KEY } from "@entities/tag/model/keys"
import { Tag } from "@entities/tag/model/types"
import { http } from "@shared/api"
import { useQuery } from "@tanstack/react-query"

const getTags = async () => {
  const response = await http.get<Tag[]>("/posts/tags")

  return response
}

export const useGetTags = () => {
  return useQuery({
    queryKey: TAGS_QUERY_KEY.lists(),
    queryFn: getTags,
  })
}
