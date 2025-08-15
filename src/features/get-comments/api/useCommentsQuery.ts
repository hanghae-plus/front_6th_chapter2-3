import { useQuery } from "@tanstack/react-query"

import { fetchCommentsByPostId } from "@/entities/comment/api/comments"
import { commentKeys } from "@/entities/comment/lib"
import type { FetchCommentsByPostId } from "@/entities/comment/model"

export function useCommentsQuery(payload: FetchCommentsByPostId.Payload) {
  const { postId } = payload

  return useQuery({
    queryKey: commentKeys.byPost(postId),
    queryFn: () => fetchCommentsByPostId({ postId }),
    enabled: !!postId,
  })
}
