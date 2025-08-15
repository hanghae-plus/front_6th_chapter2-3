import { useMutation, useQueryClient } from "@tanstack/react-query"

import { updateComment } from "@/entities/comment/api/comments"
import { commentKeys } from "@/entities/comment/lib"
import type { UpdateComment } from "@/entities/comment/model"

export function useUpdateCommentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateComment.Payload) => updateComment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.all })
    },
    onError: (error) => {
      console.error("Comment 수정 실패:", error)
    },
  })
}
