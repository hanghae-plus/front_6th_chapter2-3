import { useQuery } from "@tanstack/react-query"
import { getTags } from "@/entities/tag/api"
import { TAG_QUERY_KEYS } from "@/entities/tag/model/query-key"

// 태그 목록 조회 훅 (PostsManagerPage에서 실제 사용)
export const useTags = () => {
  return useQuery({
    queryKey: TAG_QUERY_KEYS.lists(),
    queryFn: () => getTags(),
    staleTime: 30 * 60 * 1000, // 30분
    gcTime: 60 * 60 * 1000, // 1시간
  })
}
