import { useQuery } from "@tanstack/react-query"
import { getTags } from "@/entities/tag/api"
import { TAG_QUERY_KEYS } from "@/entities/tag/model/query-key"

// 태그 목록 조회 훅 (PostsManagerPage에서 실제 사용)
export const useTags = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: TAG_QUERY_KEYS.lists(),
    queryFn: () => getTags(),
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    gcTime: 10 * 60 * 1000,   // 10분간 메모리 유지
  })

  return { data, isLoading, error }
}
