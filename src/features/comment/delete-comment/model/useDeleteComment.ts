import { useMutation } from "@tanstack/react-query"
import { commentMutations } from "@entities/comment/api/mutations"
import type { CommentItem } from "@entities/comment/model"

export const useDeleteComment = () => {
  const deleteMutation = useMutation(commentMutations.deleteMutation())

  const deleteComment = (comment: CommentItem) => {
    deleteMutation.mutate({
      id: comment.id,
      postId: comment.postId,
      isTemporary: comment.isTemporary,
    })
  }

  return { deleteComment, isPending: deleteMutation.isPending }
}
