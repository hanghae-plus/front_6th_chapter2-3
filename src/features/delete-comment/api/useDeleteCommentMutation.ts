import { useMutation, useQueryClient } from "@tanstack/react-query"

import { deleteComment } from "@/entities/comment/api/comments"
import { commentKeys } from "@/entities/comment/lib"
import type { DeleteComment } from "@/entities/comment/model"

export function useDeleteCommentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: DeleteComment.Payload) => deleteComment(payload),
    onSuccess: (_, variables) => {
      queryClient.removeQueries({ queryKey: commentKeys.detail(variables.commentId) })
      queryClient.setQueryData(commentKeys.byPost(variables.postId), (old: unknown) => {
        if (!old) return undefined
        const oldData = old as { comments: Array<{ id: number }>; total?: number }
        return {
          ...oldData,
          comments: oldData.comments.filter((comment: unknown) => {
            const typedComment = comment as { id: number }
            return typedComment.id !== variables.commentId
          }),
          ...(oldData.total !== undefined && { total: Math.max(0, oldData.total - 1) }),
        }
      })
    },
    onError: (error) => {
      console.error("Comment 삭제 실패:", error)
      queryClient.invalidateQueries({ queryKey: commentKeys.all })
    },
  })
}
