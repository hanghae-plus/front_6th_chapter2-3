import { useSearchParams } from 'react-router-dom';

interface QueryParams {
  skip: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  search: string;
  tag: string;
}

export const useQueryParameter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = {
    skip: Number(searchParams.get('skip')) || 0,
    limit: Number(searchParams.get('limit')) || 10,
    sortBy: searchParams.get('sortBy') || '',
    sortOrder: searchParams.get('sortOrder') || 'asc',
    searchQuery: searchParams.get('search') || '',
    selectedTag: searchParams.get('tag') || '',
  };

  const setParam = (
    key: keyof QueryParams,
    value: string | number,
    clearKey?: keyof QueryParams
  ) => {
    const newParams = new URLSearchParams(searchParams);

    if (value === '' || value === 0) {
      newParams.delete(key);
    } else {
      newParams.set(key, String(value));
    }

    if (clearKey) newParams.delete(clearKey);

    setSearchParams(newParams, { replace: true });
  };

  const setters = {
    setSkip: (skip: number) => setParam('skip', skip),
    setLimit: (limit: number) => setParam('limit', limit),
    setSortBy: (sortBy: string) => setParam('sortBy', sortBy),
    setSortOrder: (sortOrder: 'asc' | 'desc') => setParam('sortOrder', sortOrder),
    setSearchQuery: (search: string) => setParam('search', search, 'tag'),
    setSelectedTag: (tag: string) => {
      if (tag === 'all') {
        setParam('tag', '', 'search');
      } else {
        setParam('tag', tag, 'search');
      }
    },
  };

  return { params, setters };
};
