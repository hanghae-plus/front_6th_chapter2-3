import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updatePost, IPost } from '@entities/post'

export function useUpdatePostMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: IPost) => updatePost(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}
