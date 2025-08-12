import { useQuery } from '@tanstack/react-query';
import { IPosts } from './type';
import {
  getPostsApi,
  getPostsBySearchApi,
  getPostsByTagApi,
} from '../api/post-api';

/**
 * 게시물 목록
 */
export const usePostsQuery = (limit: number, skip: number) => {
  return useQuery<IPosts>({
    queryKey: ['posts', limit, skip],
    queryFn: () => getPostsApi(limit, skip),
  });
};

/**
 * 게시물 검색
 */
export const usePostsBySearchQuery = (searchQuery: string) => {
  return useQuery<IPosts>({
    queryKey: ['posts', 'search', searchQuery],
    queryFn: () => getPostsBySearchApi(searchQuery),
    enabled: !!searchQuery,
  });
};

/**
 * 태그별 게시물
 */
export const usePostsByTagQuery = (tag: string) => {
  return useQuery<IPosts>({
    queryKey: ['posts', 'tag', tag],
    queryFn: () => getPostsByTagApi(tag),
    enabled: !!tag,
  });
};
