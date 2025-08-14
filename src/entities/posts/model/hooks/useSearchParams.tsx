import { useSearchParams as useReactRouterSearchParams } from 'react-router-dom';
import type { PostSortBy, SortOrder } from '../types';
import { useSearchParams } from '@/shared/lib';

export const useSkip = () => useSearchParams<number>('skip', '0', parseInt);

export const useLimit = () => useSearchParams<number>('limit', '10', parseInt);

export const useSearchQuery = (): ReturnType<
  typeof useSearchParams<string>
> => {
  const [searchParams, setSearchParams] = useReactRouterSearchParams();

  const setSearch = (value: string) => {
    setSearchParams((searchParams) => {
      searchParams.set('search', value);
      searchParams.set('tag', '');
      return searchParams;
    });
  };

  return [searchParams.get('search') ?? '', setSearch];
};

export const useSortBy = () => useSearchParams<PostSortBy>('sortBy', 'nonde');

export const useSortOrder = () =>
  useSearchParams<SortOrder>('sortOrder', 'asc');

export const useTag = (): ReturnType<typeof useSearchParams<string>> => {
  const [searchParams, setSearchParams] = useReactRouterSearchParams();

  const setTag = (value: string) => {
    setSearchParams((searchParams) => {
      searchParams.set('tag', value);
      searchParams.set('search', '');
      return searchParams;
    });
  };

  return [searchParams.get('tag') ?? '', setTag];
};
