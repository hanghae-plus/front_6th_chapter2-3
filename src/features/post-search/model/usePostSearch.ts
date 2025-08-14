import { useEffect } from 'react';

import { usePostSearchStore } from './postSearchStore';

import { useUrlQuery } from '@/shared/hooks/useUrlQuery';

export const usePostSearch = () => {
  const { searchParams, updateQuery } = useUrlQuery();
  const { searchQuery, inputValue, setSearchQuery, setInputValue } = usePostSearchStore();

  useEffect(() => {
    const initialSearchQuery = searchParams.get('search') || '';
    setSearchQuery(initialSearchQuery);
    setInputValue(initialSearchQuery);
  }, [searchParams]);

  const confirmSearch = () => {
    setSearchQuery(inputValue);
    updateQuery({ search: inputValue || null });
  };

  return {
    inputValue,
    setInputValue,
    confirmSearch,
    searchQuery,
  };
};
