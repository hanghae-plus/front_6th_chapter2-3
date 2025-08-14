import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deletePost } from '@entities/post'

export function useDeletePostMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deletePost({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}
