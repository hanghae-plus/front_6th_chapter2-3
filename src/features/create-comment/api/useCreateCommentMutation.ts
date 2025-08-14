import { useMutation, useQueryClient } from "@tanstack/react-query"

import { addComment } from "@/entities/comment/api/comments"
import type { AddComment } from "@/entities/comment/model"

export function useCreateCommentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AddComment.Payload) => addComment(payload),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["comments", "post", { postId: variables.postId }], (old: unknown) => {
        const newComment = { ...data, likes: 0 }
        const oldData = old as { comments: unknown[] } | undefined
        return oldData ? { ...oldData, comments: [...oldData.comments, newComment] } : { comments: [newComment] }
      })
    },
    onError: (error) => {
      console.error("Comment 생성 실패:", error)
    },
  })
}
