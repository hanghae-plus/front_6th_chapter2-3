import { useEffect } from 'react';
import { usePostsUrlParams } from '../../posts-list/model/hooks';
import { usePostsFilter } from '../../posts-filter/model/hooks';

export const usePagination = () => {
  const { skip, limit, setSkip, setLimit } = usePostsUrlParams();
  const { applyFilters } = usePostsFilter();

  useEffect(() => {
    applyFilters();
  }, [skip, limit, applyFilters]);

  return {
    skip,
    limit,
    setSkip,
    setLimit,
  };
};
