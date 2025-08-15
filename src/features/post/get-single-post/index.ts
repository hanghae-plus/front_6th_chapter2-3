import { useQuery } from '@tanstack/react-query'
import { IPost } from '@entities/post'
import { http } from '@shared/lib/http-client'

export const usePostQuery = (postId: number, options: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: () => http.get<IPost>(`/posts/${postId}`),
    enabled: options.enabled !== false && !!postId,
  })
}
