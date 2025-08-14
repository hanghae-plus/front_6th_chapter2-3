import { useMutation } from "@tanstack/react-query"
import { postMutations } from "@entities/post/api/mutations"
import type { Post } from "@entities/post/model"

export const useDeletePost = () => {
  const deletePostMutation = useMutation(postMutations.deleteMutation())

  const deletePost = (post: Post) => {
    deletePostMutation.mutate({
      id: post.id,
      isTemporary: post.isTemporary,
    })
  }

  return {
    deletePost,
    isPending: deletePostMutation.isPending,
    isError: deletePostMutation.isError,
    error: deletePostMutation.error,
  }
}
