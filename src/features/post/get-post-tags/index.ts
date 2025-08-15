import { useQuery } from '@tanstack/react-query'
import { fetchTags } from '@entities/post'

export function useTagsQuery() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: () => fetchTags(),
  })
}
