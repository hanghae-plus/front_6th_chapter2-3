import { useQuery } from "@tanstack/react-query"

import { fetchCommentsByPostId } from "@/entities/comment/api/comments"
import type { FetchCommentsByPostId } from "@/entities/comment/model"

export function useCommentsQuery(payload: FetchCommentsByPostId.Payload) {
  const { postId } = payload

  return useQuery({
    queryKey: ["comments", "post", { postId }],
    queryFn: () => fetchCommentsByPostId({ postId }),
    enabled: !!postId,
  })
}
