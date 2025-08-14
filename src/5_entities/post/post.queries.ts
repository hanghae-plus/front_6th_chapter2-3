import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/shared/index';

import {
  getPosts,
  getPostsBySearch,
  getPostsByTag,
  GetPostsParams,
} from './post.api';

export const useGetPostsQuery = (params: GetPostsParams) => {
  return useQuery({
    queryKey: queryKeys.posts.list(params),
    queryFn: () => getPosts(params),
  });
};

export const useGetPostsByTagQuery = (tag: string) => {
  return useQuery({
    queryKey: queryKeys.posts.list({ tag }),
    queryFn: () => getPostsByTag({ tag }),
  });
};

export const postQueryOptions = {
  getPosts: (params: GetPostsParams) => ({
    queryKey: queryKeys.posts.list(params),
    queryFn: () => getPosts(params),
  }),
};

export const useGetPostsBySearchQuery = (search: string) => {
  return useQuery({
    queryKey: queryKeys.posts.search(search),
    queryFn: () => getPostsBySearch({ search }),
  });
};
