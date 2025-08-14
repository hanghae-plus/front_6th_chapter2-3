import { useMutation, useQueryClient } from "@tanstack/react-query"

import { addComment } from "@/entities/comment/api/comments"
import type { AddComment } from "@/entities/comment/model"

export function useCreateCommentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AddComment.Payload) => addComment(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", "post", variables.postId],
      })
    },
    onError: (error) => {
      console.error("Comment 생성 실패:", error)
    },
  })
}