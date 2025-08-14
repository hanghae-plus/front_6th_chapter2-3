import { useEffect } from 'react';
import { usePostsUrlParams } from '../../list-posts/model/hooks';
import { usePostsFilter } from '../../filter-posts/model/hooks';

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
