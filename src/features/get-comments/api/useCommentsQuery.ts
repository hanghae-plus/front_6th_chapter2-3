import { useQuery } from "@tanstack/react-query"

import { fetchCommentsByPostId } from "@/entities/comment/api/comments"
import type { FetchCommentsByPostId } from "@/entities/comment/model"

export function useCommentsQuery(payload: FetchCommentsByPostId.Payload) {
  return useQuery({
    queryKey: ["comments", "post", payload],
    queryFn: () => fetchCommentsByPostId(payload),
    enabled: !!payload.postId,
  })
}
