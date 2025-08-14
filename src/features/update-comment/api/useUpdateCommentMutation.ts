import { useMutation, useQueryClient } from "@tanstack/react-query"

import { updateComment } from "@/entities/comment/api/comments"
import type { UpdateComment } from "@/entities/comment/model"

export function useUpdateCommentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateComment.Payload) => updateComment(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", "post", variables.postId],
      })
    },
    onError: (error) => {
      console.error("Comment 수정 실패:", error)
    },
  })
}