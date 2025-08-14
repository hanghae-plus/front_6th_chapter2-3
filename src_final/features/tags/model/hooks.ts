import { useQuery } from '@tanstack/react-query';

import { postsApi, PostTag } from '@/entities/posts';

export const useTags = () => {
  return useQuery<PostTag[]>({
    queryKey: ['tags'],
    queryFn: async () => {
      const tagsData = await postsApi.getTags();
      return tagsData;
    },
  });
};
