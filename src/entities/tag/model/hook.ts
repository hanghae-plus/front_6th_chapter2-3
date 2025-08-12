import { useQuery } from '@tanstack/react-query';
import { getTags } from '../api/tag-api';
import { ITag } from './type';

/**
 * 태그 목록 조회
 */
export const useTagsQuery = () => {
  return useQuery<ITag[]>({
    queryKey: ['tags'],
    queryFn: getTags,
  });
};
