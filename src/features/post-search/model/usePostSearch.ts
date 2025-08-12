import { useState } from 'react';

import { useUrlQuery } from '@/shared/hooks/useUrlQuery';

export const usePostSearch = () => {
  const { searchParams, updateQuery } = useUrlQuery();

  const searchQuery = searchParams.get('search') || '';

  const [inputValue, setInputValue] = useState(searchQuery);

  const setSearchQuery = (search: string) => updateQuery({ search });

  const handleSearch = () => {
    setSearchQuery(inputValue);
    updateQuery({ search: inputValue });
  };

  return {
    inputValue,
    setInputValue,
    handleSearch,
    searchQuery,
  };
};
