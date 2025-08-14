import { useQuery } from '@tanstack/react-query';

import { getTags } from '@/entities/tag';
import { queryKeys } from '@/shared/lib';

export const useGetTagsQuery = () => {
  return useQuery({
    queryKey: queryKeys.tags.lists(),
    queryFn: getTags,
  });
};
