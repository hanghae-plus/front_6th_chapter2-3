import { useMutation, useQueryClient } from "@tanstack/react-query"

import { patchComment } from "@/entities/comment/api/comments"
import { commentKeys } from "@/entities/comment/lib"
import type { PatchComment } from "@/entities/comment/model"

export function useLikeCommentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: PatchComment.Payload) => patchComment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.all })
    },
    onError: (error) => {
      console.error("Comment 좋아요 실패:", error)
    },
  })
}
