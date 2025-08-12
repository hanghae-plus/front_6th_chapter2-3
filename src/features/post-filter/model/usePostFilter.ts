import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import { useUrlQuery } from '@/shared/hooks/useUrlQuery';

export const usePostFilter = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const { updateQuery } = useUrlQuery();

  const [searchQuery, setSearchQuery] = useState(queryParams.get('search') || '');
  const [selectedTag, setSelectedTagState] = useState(queryParams.get('tag') || 'all');
  const [sortBy, setSortByState] = useState(queryParams.get('sortBy') || 'id');
  const [sortOrder, setSortOrderState] = useState(queryParams.get('sortOrder') || 'asc');

  const setSelectedTag = (tag: string) => {
    setSelectedTagState(tag);
    updateQuery({ tag: tag === 'all' ? null : tag });
  };

  const setSortBy = (sortBy: string) => {
    setSortByState(sortBy);
    updateQuery({ sortBy });
  };

  const setSortOrder = (sortOrder: string) => {
    setSortOrderState(sortOrder);
    updateQuery({ sortOrder });
  };

  return {
    searchQuery,
    selectedTag,
    sortBy,
    sortOrder,
    setSearchQuery,
    setSelectedTag,
    setSortBy,
    setSortOrder,
  };
};
