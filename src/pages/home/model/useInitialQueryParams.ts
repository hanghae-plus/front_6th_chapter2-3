import { useLocation } from 'react-router-dom';

export type SortBy = 'none' | 'id' | 'title' | 'reactions';
export type SortOrder = 'asc' | 'desc';

export type HomeQueryParams = {
  skip: number;
  limit: number;
  searchQuery: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
  selectedTag: string;
};

function isSortBy(value: string | null): value is SortBy {
  return value === 'none' || value === 'id' || value === 'title' || value === 'reactions';
}

function isSortOrder(value: string | null): value is SortOrder {
  return value === 'asc' || value === 'desc';
}

function parseInteger(value: string | null, defaultValue: number): number {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) || parsed < 0 ? defaultValue : parsed;
}

export function useInitialQueryParams(): HomeQueryParams {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const skip = parseInteger(params.get('skip'), 0);
  const limit = parseInteger(params.get('limit'), 10);
  const searchQuery = params.get('search') || '';

  const sortByParam = params.get('sortBy');
  const sortBy: SortBy = isSortBy(sortByParam) ? sortByParam : 'none';

  const sortOrderParam = params.get('sortOrder');
  const sortOrder: SortOrder = isSortOrder(sortOrderParam) ? sortOrderParam : 'asc';

  const selectedTag = params.get('tag') || '';

  return { skip, limit, searchQuery, sortBy, sortOrder, selectedTag };
}
