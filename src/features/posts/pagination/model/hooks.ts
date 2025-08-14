import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { usePostsUrlParams } from '../../list-posts/model/hooks';
import { usePostsFilter } from '../../filter-posts/model/hooks';

export const usePagination = () => {
  const location = useLocation();
  const { skip, limit, setSkip, setLimit } = usePostsUrlParams();
  const { applyFilters } = usePostsFilter();

  useEffect(() => {
    applyFilters();
  }, [skip, limit, applyFilters]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSkip(parseInt(params.get('skip') || '0'));
    setLimit(parseInt(params.get('limit') || '10'));
  }, [location.search, setSkip, setLimit]);

  return {
    skip,
    limit,
    setSkip,
    setLimit,
  };
};
