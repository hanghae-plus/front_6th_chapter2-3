import { useQuery, queryOptions } from "@tanstack/react-query"
import { commentKeys } from "@/entities/comment/model/query-key"
import { getCommentsByPost } from "@/entities/comment/api"

export const useComments = (postId: number | null) => {
  return useQuery(
    queryOptions({
      queryKey: commentKeys.listByPost(postId || 0),
      queryFn: () => getCommentsByPost(postId || 0),
      staleTime: 30_000,
      gcTime: 10 * 60 * 1000,
      enabled: postId !== null && postId > 0,
    }),
  )
}
