import { useDeletePost as useDeletePostEntity } from "@entities/post"

// Types
export interface DeletePostCallbacks {
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

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
