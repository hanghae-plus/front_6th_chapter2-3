import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import { useUrlQuery } from '@/shared/hooks/useUrlQuery';

export const usePagination = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const { updateQuery } = useUrlQuery();

  const [skip, setSkipState] = useState(parseInt(queryParams.get('skip') || '0'));
  const [limit, setLimitState] = useState(parseInt(queryParams.get('limit') || '10'));

  const setSkip = (newSkip: number) => {
    setSkipState(newSkip);
    updateQuery({ skip: newSkip });
  };

  const setLimit = (newLimit: number) => {
    setLimitState(newLimit);
    setSkip(0);
    updateQuery({ limit: newLimit, skip: 0 });
  };

  return { skip, limit, setSkip, setLimit };
};
