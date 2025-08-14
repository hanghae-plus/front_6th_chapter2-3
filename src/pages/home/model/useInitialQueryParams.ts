import { useLocation } from 'react-router-dom';

export type HomeQueryParams = {
  skip: number;
  limit: number;
  searchQuery: string;
  sortBy: 'none' | 'id' | 'title' | 'reactions';
  sortOrder: 'asc' | 'desc';
  selectedTag: string;
};

export function useInitialQueryParams(): HomeQueryParams {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const skip = parseInt(params.get('skip') || '0');
  const limit = parseInt(params.get('limit') || '10');
  const searchQuery = params.get('search') || '';
  const sortBy = (params.get('sortBy') as HomeQueryParams['sortBy']) || 'none';
  const sortOrder = (params.get('sortOrder') as HomeQueryParams['sortOrder']) || 'asc';
  const selectedTag = params.get('tag') || '';
  return { skip, limit, searchQuery, sortBy, sortOrder, selectedTag };
}
