import { useMutation, useQueryClient } from "@tanstack/react-query"

import { updateComment } from "@/entities/comment/api/comments"
import { commentKeys } from "@/entities/comment/lib"
import type { UpdateComment } from "@/entities/comment/model"

export function useUpdateCommentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateComment.Payload) => updateComment(payload),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(commentKeys.detail(variables.commentId), data)
      queryClient.setQueryData(commentKeys.byPost(variables.postId), (old: unknown) => {
        if (!old) return undefined
        const oldData = old as { comments: Array<{ id: number }> }
        return {
          ...oldData,
          comments: oldData.comments.map((comment: unknown) => {
            const typedComment = comment as { id: number }
            return typedComment.id === variables.commentId ? { ...typedComment, ...data } : comment
          }),
        }
      })
    },
    onError: (error) => {
      console.error("Comment 수정 실패:", error)
      queryClient.invalidateQueries({ queryKey: commentKeys.all })
    },
  })
}
