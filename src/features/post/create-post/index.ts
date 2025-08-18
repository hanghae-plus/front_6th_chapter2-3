import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addPost, INewPost } from '@entities/post'

export function useAddPostMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: INewPost) => addPost(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}
