import { TAGS_QUERY_KEY } from "@entities/post/const"
import { Tag } from "@entities/post/types"
import { http } from "@shared/lib/api/http"
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
