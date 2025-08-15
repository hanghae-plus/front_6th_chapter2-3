import { useMutation, useQueryClient } from "@tanstack/react-query"

import { deleteComment } from "@/entities/comment/api/comments"
import { commentKeys } from "@/entities/comment/lib"
import type { DeleteComment } from "@/entities/comment/model"

export function useDeleteCommentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: DeleteComment.Payload) => deleteComment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.all,
      })
    },
    onError: (error) => {
      console.error("Comment 삭제 실패:", error)
    },
  })
}
