import { useQuery, queryOptions } from "@tanstack/react-query"
import { commentKeys } from "@/entities/comment/model/query-key"
import { getCommentsByPost } from "@/entities/comment/api"

// seletedPostId
export const useComments = (postId: number) => {
  return useQuery(
    queryOptions({
      queryKey: commentKeys.listByPost(postId),
      queryFn: () => getCommentsByPost(postId),
      staleTime: 30_000, // 30초
      gcTime: 10 * 60 * 1000, // 10분
      enabled: !!postId,
    }),
  )
}
