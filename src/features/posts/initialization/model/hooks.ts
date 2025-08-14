import { useEffect } from 'react';
import { useTagsStore } from '../../../../entities/tags/model/store';

export const usePostsInitialization = () => {
  const { fetchTags: fetchTagsFromStore } = useTagsStore();

  useEffect(() => {
    fetchTagsFromStore();
  }, [fetchTagsFromStore]);

  return {};
};
