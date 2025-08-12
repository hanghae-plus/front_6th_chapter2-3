import { useQuery } from '@tanstack/react-query';
import { IPosts } from './type';
import {
  getPostsApi,
  getPostsBySearchApi,
  getPostsByTagApi,
} from '../api/post-api';

export const usePostsQuery = (limit: number, skip: number) => {
  return useQuery<IPosts>({
    queryKey: ['posts', limit, skip],
    queryFn: () => getPostsApi(limit, skip),
  });
};

export const usePostsBySearchQuery = (searchQuery: string) => {
  return useQuery<IPosts>({
    queryKey: ['posts', 'search', searchQuery],
    queryFn: () => getPostsBySearchApi(searchQuery),
    enabled: !!searchQuery,
  });
};

export const usePostsByTagQuery = (tag: string) => {
  return useQuery<IPosts>({
    queryKey: ['posts', 'tag', tag],
    queryFn: () => getPostsByTagApi(tag),
    enabled: !!tag,
  });
};
