import { useEffect } from 'react';

import { usePaginationStore } from './paginationStore';

import { useUrlQuery } from '@/shared/hooks/useUrlQuery';

export const usePagination = () => {
  const { searchParams, updateQuery } = useUrlQuery();
  const { limit, skip, setLimit, setSkip } = usePaginationStore();

  useEffect(() => {
    const limitFromUrl = parseInt(searchParams.get('limit') || '10', 10);
    const skipFromUrl = parseInt(searchParams.get('skip') || '0', 10);

    setLimit(limitFromUrl);
    setSkip(skipFromUrl);
  }, [searchParams]);

  const handleSetLimit = (newLimit: number) => {
    setLimit(newLimit);
    updateQuery({ limit: newLimit, skip: 0 });
  };

  const handleSetSkip = (newSkip: number) => {
    setSkip(newSkip);
    updateQuery({ skip: newSkip });
  };

  return {
    limit,
    skip,
    setLimit: handleSetLimit,
    setSkip: handleSetSkip,
  };
};
