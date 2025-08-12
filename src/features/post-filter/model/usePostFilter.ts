import { useState } from 'react';
import { useLocation } from 'react-router-dom';

export const usePostFilter = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [searchQuery, setSearchQuery] = useState(queryParams.get('search') || '');
  const [selectedTag, setSelectedTag] = useState(queryParams.get('tag') || 'all');
  const [sortBy, setSortBy] = useState(queryParams.get('sortBy') || 'id');
  const [sortOrder, setSortOrder] = useState(queryParams.get('sortOrder') || 'asc');

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
