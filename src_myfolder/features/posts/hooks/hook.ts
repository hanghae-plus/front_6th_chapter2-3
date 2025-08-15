import { useQuery } from "@tanstack/react-query"
import { fetchTags } from "../../../entities/post/api"

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
    staleTime: Infinity, // 캐시 값을 유지하기 위해 staleTime을 Infinity로 설정합니다.
  })
}
