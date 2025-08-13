import { useDeletePost as useDeletePostEntity } from "@entities/post"
import type { DeletePostCallbacks } from "@/features/remove-post/model/types"

export const useRemovePost = () => {
  const deletePostMutation = useDeletePostEntity()

  const handleRemove = (postId: number, callbacks: DeletePostCallbacks = {}) => {
    deletePostMutation.mutate(postId, {
      onSuccess: () => {
        callbacks.onSuccess?.()
      },
      onError: (error) => {
        callbacks.onError?.(error)
      },
    })
  }

  return {
    handleRemove,
    isLoading: deletePostMutation.isPending,
  }
}
