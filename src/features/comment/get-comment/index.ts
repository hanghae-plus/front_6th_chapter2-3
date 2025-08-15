import { useQuery } from '@tanstack/react-query'
import { fetchComments, IComment } from '@entities/comment'

export function useCommentsQuery(postId: number) {
  return useQuery<IComment[]>({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const { comments } = await fetchComments(postId)
      return comments
    },
    enabled: !!postId,
  })
}
