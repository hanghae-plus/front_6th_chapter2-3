import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { GetPostsListRequestType, GetPostsListResponseType } from '../model';

import { getPosts, getPostsBySearch, getPostsByTag } from './index';

export const usePostListQuery = (
  params: GetPostsListRequestType,
  options?: UseQueryOptions<GetPostsListResponseType>,
) => {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: () => getPosts(params),
    ...options,
  });
};

export const usePostListBySearchQuery = (
  search: string,
  options?: UseQueryOptions<GetPostsListResponseType>,
) => {
  return useQuery({
    queryKey: ['posts', search],
    queryFn: () => getPostsBySearch(search),
    ...options,
  });
};

export const useGetPostListByTagQuery = (
  tag: string,
  options?: UseQueryOptions<GetPostsListResponseType>,
) => {
  return useQuery({
    queryKey: ['posts', tag],
    queryFn: () => getPostsByTag(tag),
    ...options,
  });
};
