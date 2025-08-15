import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateComment, IComment } from '@entities/comment'

export function useUpdateCommentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: IComment) => updateComment(payload),
    onSuccess: (data) => {
      const postId = (data as unknown as { postId: number }).postId
      if (postId) {
        queryClient.invalidateQueries({ queryKey: ['comments', postId] })
      } else {
        queryClient.invalidateQueries({ queryKey: ['comments'] })
      }
    },
  })
}
