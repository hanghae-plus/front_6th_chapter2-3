import { useQuery } from '@tanstack/react-query'
import { fetchPosts } from '@entities/post'

export function usePostsBasic(params: { limit: number; skip: number; enabled?: boolean }) {
  const { limit, skip, enabled = true } = params
  return useQuery({
    queryKey: ['posts', 'basic', { limit, skip }],
    queryFn: () => fetchPosts({ limit, skip }),
    enabled,
  })
}
