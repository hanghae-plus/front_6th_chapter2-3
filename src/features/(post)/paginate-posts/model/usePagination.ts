import { useCallback, useState } from 'react';

export function usePagination(initialLimit: number = 10, initialSkip: number = 0) {
  const [limit, setLimit] = useState<number>(initialLimit);
  const [skip, setSkip] = useState<number>(initialSkip);

  const next = useCallback(() => setSkip((prev) => prev + limit), [limit]);
  const prev = useCallback(() => setSkip((prev) => Math.max(0, prev - limit)), [limit]);
  const setPageSize = useCallback((size: number) => setLimit(size), []);
  const reset = useCallback(() => {
    setSkip(0);
  }, []);

  return { limit, skip, next, prev, setPageSize, reset, setSkip } as const;
}
