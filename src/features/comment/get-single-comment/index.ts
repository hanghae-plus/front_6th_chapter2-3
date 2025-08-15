import { useQuery } from '@tanstack/react-query'
import { IComment } from '@entities/comment'
import { http } from '@shared/lib/http-client'

export const useCommentQuery = (commentId: number, options: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: ['comment', commentId],
    queryFn: () => http.get<IComment>(`/comments/${commentId}`),
    enabled: options.enabled !== false && !!commentId,
  })
}
