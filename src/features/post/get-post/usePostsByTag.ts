import { useQuery } from '@tanstack/react-query'
import { fetchPostsByTag } from '@entities/post'

export function usePostsByTag(params: { tag: string; enabled?: boolean }) {
  const { tag, enabled = true } = params
  return useQuery({
    queryKey: ['posts', 'tag', { tag }],
    queryFn: () => fetchPostsByTag(tag),
    enabled,
  })
}
