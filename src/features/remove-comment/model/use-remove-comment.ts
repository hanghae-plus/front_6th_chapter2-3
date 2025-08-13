import { useDeleteComment } from "@entities/comment"
import type { RemoveCommentCallbacks } from "./types"

export const useRemoveComment = () => {
  const deleteCommentMutation = useDeleteComment()

  const handleRemove = (commentId: number, postId: number, callbacks?: RemoveCommentCallbacks) => {
    deleteCommentMutation.mutate(
      { id: commentId, postId },
      {
        onSuccess: callbacks?.onSuccess,
        onError: callbacks?.onError,
      }
    )
  }

  return {
    handleRemove,
    isLoading: deleteCommentMutation.isPending,
  }
}