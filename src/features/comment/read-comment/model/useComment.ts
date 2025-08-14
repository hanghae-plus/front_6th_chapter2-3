import { useQuery, queryOptions } from "@tanstack/react-query"
import { commentKeys } from "@/entities/comment/model/query-key"
import { getComment } from "@/entities/comment/api"

export const useComment = (commentId: number) => {
  return useQuery(
    queryOptions({
      queryKey: commentKeys.detail(commentId),
      queryFn: () => getComment(commentId),
      staleTime: 30_000, // 30초
      gcTime: 10 * 60 * 1000, // 10분
      enabled: !!commentId,
    }),
  )
}
