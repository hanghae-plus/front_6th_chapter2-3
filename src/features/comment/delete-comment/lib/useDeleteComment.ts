import { useMutation } from "@tanstack/react-query"
import { commentMutations } from "../../../../entities/comment/api/mutations"

export const useDeleteComment = () => {
  const deleteCommentMutation = useMutation(commentMutations.deleteMutation())

  const deleteComment = (postId: number, id: number) => {
    deleteCommentMutation.mutate({ id, postId })
  }

  return { deleteComment, isPending: deleteCommentMutation.isPending }
}
