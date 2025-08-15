import { useDeleteComment } from "@entities/comment"

// Types
export interface RemoveCommentCallbacks {
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

export const useRemoveComment = () => {
  const deleteCommentMutation = useDeleteComment()

  const handleRemove = (commentId: number, postId: number, callbacks?: RemoveCommentCallbacks) => {
    deleteCommentMutation.mutate(
      { id: commentId, postId },
      {
        onSuccess: callbacks?.onSuccess,
        onError: callbacks?.onError,
      },
    )
  }

  return {
    handleRemove,
    isLoading: deleteCommentMutation.isPending,
  }
}
