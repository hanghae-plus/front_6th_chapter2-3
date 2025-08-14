import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteComment } from '@entities/comment'

export function useDeleteCommentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, postId }: { id: number; postId: number }) => {
      await deleteComment(id)
      return postId
    },
    onSuccess: (postId: number) => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
    },
  })
}
