import { useQuery } from '@tanstack/react-query';

import { GetPostsListRequestType } from '../model';

import { getPosts, getPostsBySearch, getPostsByTag } from './index';

export const usePostListQuery = (
  params: GetPostsListRequestType,
  options?: { enabled: boolean },
) => {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: () => getPosts(params),
    enabled: options?.enabled,
  });
};

export const usePostListBySearchQuery = (
  search: string,
  params?: GetPostsListRequestType,
  options?: { enabled: boolean },
) => {
  return useQuery({
    queryKey: ['posts', search, params],
    queryFn: () => getPostsBySearch(search, params),
    ...options,
  });
};

export const useGetPostListByTagQuery = (
  tag: string,
  params?: GetPostsListRequestType,
  options?: { enabled: boolean },
) => {
  return useQuery({
    queryKey: ['posts', tag, params],
    queryFn: () => getPostsByTag(tag, params),
    ...options,
  });
};
