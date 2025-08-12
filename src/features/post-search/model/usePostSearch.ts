import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import { useUrlQuery } from '@/shared/hooks/useUrlQuery';

export const usePostSearch = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const { updateQuery } = useUrlQuery();

  const [searchQuery, setSearchQuery] = useState(queryParams.get('search') || '');
  const [inputValue, setInputValue] = useState(searchQuery);

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
