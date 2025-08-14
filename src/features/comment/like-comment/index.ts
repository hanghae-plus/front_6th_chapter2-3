import { useMutation, useQueryClient } from '@tanstack/react-query'
import { likeComment } from '@entities/comment'

export function useLikeCommentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, likes, postId }: { id: number; likes: number; postId: number }) => {
      await likeComment(id, likes)
      return postId
    },
    onSuccess: (postId: number) => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
    },
  })
}
