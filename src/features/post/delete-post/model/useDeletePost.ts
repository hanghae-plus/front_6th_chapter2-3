import { useMutation } from "@tanstack/react-query"
import { postMutations } from "@entities/post/api/mutations"

export const useDeletePost = () => {
  const deletePostMutation = useMutation(postMutations.deleteMutation())

  const deletePost = (id: number) => {
    deletePostMutation.mutate(id)
  }

  return {
    deletePost,
    isPending: deletePostMutation.isPending,
    isError: deletePostMutation.isError,
    error: deletePostMutation.error,
  }
}
