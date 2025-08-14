import { useQuery, queryOptions } from "@tanstack/react-query"
import { commentKeys } from "@/entities/comment/model/query-key"
import { getCommentsByPost } from "@/entities/comment/api"

// seletedPostId
export const useComments = (postId: number | null) => {
  return useQuery(
    queryOptions({
      queryKey: commentKeys.listByPost(postId || 0),
      queryFn: () => getCommentsByPost(postId || 0),
      staleTime: 30_000, // 30초
      gcTime: 10 * 60 * 1000, // 10분
      enabled: postId !== null && postId > 0,
    }),
  )
}
