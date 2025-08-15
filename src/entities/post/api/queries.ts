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

export const usePostListBySearchQuery = (search: string, options?: { enabled: boolean }) => {
  return useQuery({
    queryKey: ['posts', search],
    queryFn: () => getPostsBySearch(search),
    ...options,
  });
};

export const useGetPostListByTagQuery = (tag: string, options?: { enabled: boolean }) => {
  return useQuery({
    queryKey: ['posts', tag],
    queryFn: () => getPostsByTag(tag),
    ...options,
  });
};
