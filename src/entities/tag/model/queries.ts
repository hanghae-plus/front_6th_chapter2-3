import { useQuery } from '@tanstack/react-query'
import { tagApi } from '../api'
import { Tag } from './types'

// 태그 목록 조회
export const useTags = () => {
  return useQuery<Tag[]>({
    queryKey: ['tags', 'list'],
    queryFn: () => tagApi.getTags(),
  })
}
