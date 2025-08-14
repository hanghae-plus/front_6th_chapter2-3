import { useQuery } from "@tanstack/react-query"
import { fetchTags } from "./api"

const POST_QUERY_KEY = {
  TAGS: "tags",
}

/**
 * 태그 목록 조회
 * @returns 태그 목록
 */
export const useTagsQuery = () => {
  return useQuery({
    queryKey: [POST_QUERY_KEY.TAGS],
    queryFn: () => fetchTags(),
  })
}
