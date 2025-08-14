import { useMutation, useQueryClient } from "@tanstack/react-query"

import { patchComment } from "@/entities/comment/api/comments"
import type { PatchComment } from "@/entities/comment/model"

export function useLikeCommentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: PatchComment.Payload) => patchComment(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", "post", variables.commentId],
      })
    },
    onError: (error) => {
      console.error("Comment 좋아요 실패:", error)
    },
  })
}
