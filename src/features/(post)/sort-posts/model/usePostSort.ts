import { useCallback, useState } from 'react';

export type SortBy = 'none' | 'id' | 'title' | 'reactions';
export type SortOrder = 'asc' | 'desc';

export function usePostSort(initialBy: SortBy = 'none', initialOrder: SortOrder = 'asc') {
  const [sortBy, setSortBy] = useState<SortBy>(initialBy);
  const [sortOrder, setSortOrder] = useState<SortOrder>(initialOrder);

  const setBy = useCallback((by: SortBy) => setSortBy(by), []);
  const setOrder = useCallback((order: SortOrder) => setSortOrder(order), []);

  return { sortBy, sortOrder, setBy, setOrder } as const;
}
