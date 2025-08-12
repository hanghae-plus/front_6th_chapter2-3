import { useQuery } from '@tanstack/react-query';
import { getTags } from '../api/tag-api';
import { ITag } from './type';

export const useTagsQuery = () => {
  return useQuery<ITag[]>({
    queryKey: ['tags'],
    queryFn: getTags,
  });
};
