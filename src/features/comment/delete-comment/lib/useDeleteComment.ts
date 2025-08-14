import { useMutation } from "@tanstack/react-query"
import { commentMutations } from "@entities/comment/api/mutations"

export const useDeleteComment = () => {
  const deleteMutation = useMutation(commentMutations.deleteMutation())

  const deleteComment = (postId: number, id: number) => {
    deleteMutation.mutate({ id, postId })
  }

  return { deleteComment, isPending: deleteMutation.isPending }
}
