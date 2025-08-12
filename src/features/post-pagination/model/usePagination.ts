import { useState } from 'react';
import { useLocation } from 'react-router-dom';

export const usePagination = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [skip, setSkip] = useState(parseInt(queryParams.get('skip') || '0'));
  const [limit, setLimit] = useState(parseInt(queryParams.get('limit') || '10'));

  return { skip, setSkip, limit, setLimit };
};
