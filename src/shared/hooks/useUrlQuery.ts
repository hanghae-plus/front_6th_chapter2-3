import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const useUrlQuery = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const updateQuery = useCallback(
    (newParams: Record<string, string | number | null | undefined>) => {
      const params = new URLSearchParams(location.search);

      Object.entries(newParams).forEach(([key, value]) => {
        if (value) {
          params.set(key, String(value));
        } else {
          params.delete(key);
        }
      });
      navigate(`?${params.toString()}`);
    },
    [location.search, navigate],
  );

  return { updateQuery };
};
