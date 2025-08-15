import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useUrlQuery = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateQuery = useCallback(
    (newParams: Record<string, string | number | null | undefined>) => {
      const params = new URLSearchParams(searchParams);

      Object.entries(newParams).forEach(([key, value]) => {
        if (value) {
          params.set(key, String(value));
        } else {
          params.delete(key);
        }
      });
      setSearchParams(params);
    },
    [searchParams, setSearchParams],
  );

  return { searchParams, updateQuery };
};
