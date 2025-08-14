import { useCallback, useState } from 'react';

export function usePostSearch(initialQuery: string = '') {
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);

  const setQuery = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return { searchQuery, setQuery } as const;
}
