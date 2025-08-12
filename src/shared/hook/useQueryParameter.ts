import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface QueryParams {
  skip: number;
  limit: number;
  searchQuery: string;
  sortBy: string;
  sortOrder: string;
  selectedTag: string;
}

const defaultParams: QueryParams = {
  skip: 0,
  limit: 10,
  searchQuery: '',
  sortBy: '',
  sortOrder: 'asc',
  selectedTag: '',
};

export const useQueryParameter = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [skip, setSkip] = useState<number>(defaultParams.skip);
  const [limit, setLimit] = useState<number>(defaultParams.limit);
  const [searchQuery, setSearchQuery] = useState<string>(
    defaultParams.searchQuery
  );
  const [sortBy, setSortBy] = useState<string>(defaultParams.sortBy);
  const [sortOrder, setSortOrder] = useState<string>(defaultParams.sortOrder);
  const [selectedTag, setSelectedTag] = useState<string>(
    defaultParams.selectedTag
  );

  // URL를 상태에 반영
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    setSkip(parseInt(params.get('skip') ?? '') || defaultParams.skip);
    setLimit(parseInt(params.get('limit') ?? '') || defaultParams.limit);
    setSearchQuery(params.get('search') ?? defaultParams.searchQuery);
    setSortBy(params.get('sortBy') ?? defaultParams.sortBy);
    setSortOrder(params.get('sortOrder') ?? defaultParams.sortOrder);
    setSelectedTag(params.get('tag') ?? defaultParams.selectedTag);
  }, [location.search]);

  // 상태를 URL에 반영
  useEffect(() => {
    const params = new URLSearchParams();

    if (skip !== defaultParams.skip) params.set('skip', skip.toString());
    if (limit !== defaultParams.limit) params.set('limit', limit.toString());
    if (searchQuery !== defaultParams.searchQuery)
      params.set('search', searchQuery);
    if (sortBy !== defaultParams.sortBy) params.set('sortBy', sortBy);
    if (sortOrder !== defaultParams.sortOrder)
      params.set('sortOrder', sortOrder);
    if (selectedTag !== defaultParams.selectedTag)
      params.set('tag', selectedTag);

    // 쿼리가 바뀌었을 때만 navigate 호출
    const newQuery = params.toString();
    
    const currentQuery = location.search.startsWith('?')
      ? location.search.slice(1)
      : location.search;

    if (newQuery !== currentQuery) {
      navigate(`?${newQuery}`, { replace: true });
    }
  }, [
    skip,
    limit,
    searchQuery,
    sortBy,
    sortOrder,
    selectedTag,
    navigate,
    location.search,
  ]);

  return {
    skip,
    setSkip,
    limit,
    setLimit,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    selectedTag,
    setSelectedTag,
  };
};
