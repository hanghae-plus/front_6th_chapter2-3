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

  // 프론트에서 사용할 변수명
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
    clearOther?: keyof QueryParams
  ) => {
    const newParams = new URLSearchParams(searchParams);

    if (value === '' || value === 0) {
      newParams.delete(key);
    } else {
      newParams.set(key, String(value));
    }

    if (clearOther) newParams.delete(clearOther);

    setSearchParams(newParams, { replace: true });
  };

  const setters = {
    setSkip: (v: number) => setParam('skip', v),
    setLimit: (v: number) => setParam('limit', v),
    setSortBy: (v: string) => setParam('sortBy', v),
    setSortOrder: (v: 'asc' | 'desc') => setParam('sortOrder', v),
    setSearchQuery: (v: string) => setParam('search', v, 'tag'),
    setSelectedTag: (v: string) => {
      if (v === 'all') {
        setParam('tag', '', 'search');
      } else {
        setParam('tag', v, 'search');
      }
    },
  };

  return { params, setters };
};
