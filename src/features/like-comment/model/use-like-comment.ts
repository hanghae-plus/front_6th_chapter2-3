import { usePatchCommentLikes } from "@entities/comment"

// Types
export interface LikeCommentCallbacks {
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

export const useLikeComment = () => {
  const likeCommentMutation = usePatchCommentLikes()

  const handleLike = (commentId: number, postId: number, currentLikes: number, callbacks?: LikeCommentCallbacks) => {
    likeCommentMutation.mutate(
      { id: commentId, postId, currentLikes },
      {
        onSuccess: callbacks?.onSuccess,
        onError: callbacks?.onError,
      }
    )
  }

  return {
    handleLike,
    isLoading: likeCommentMutation.isPending,
  }
}