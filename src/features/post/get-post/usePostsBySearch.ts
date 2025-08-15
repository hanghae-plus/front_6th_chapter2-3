import { useQuery } from '@tanstack/react-query'
import { fetchPostsBySearch } from '@entities/post'

export function usePostsBySearch(params: { query: string; enabled?: boolean }) {
  const { query, enabled = true } = params
  return useQuery({
    queryKey: ['posts', 'search', { query }],
    queryFn: () => fetchPostsBySearch({ query }),
    enabled,
  })
}
