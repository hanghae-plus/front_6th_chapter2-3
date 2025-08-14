import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/shared/lib';
import { MutationProps } from '@/shared/types';

import {
  createPost,
  deletePost,
  getPosts,
  getPostsBySearch,
  GetPostsBySearchParams,
  getPostsByTag,
  GetPostsParams,
  putPost,
} from './post.api';
import { GetPostsResponse, Post } from './post.type';

export const useGetPostsQuery = (params: GetPostsParams) => {
  return useQuery({
    queryKey: queryKeys.posts.list(params),
    queryFn: () => getPosts(params),
  });
};

export interface GetPostsByTagParams extends GetPostsParams {
  tag: string;
}

export const useGetPostsByTagQuery = (params: GetPostsByTagParams) => {
  return useQuery({
    queryKey: queryKeys.posts.list(params),
    queryFn: () => getPostsByTag(params),
    enabled: !!params.tag && params.tag !== 'all',
  });
};

export const useGetPostsBySearchQuery = ({
  search,
  limit,
  skip,
}: GetPostsBySearchParams) => {
  return useQuery({
    queryKey: queryKeys.posts.list({
      searchQuery: search,
    }),
    queryFn: () => getPostsBySearch({ search, limit, skip }),
    enabled: !!search && search.trim() !== '',
  });
};

export const useCreatePostMutation = ({
  onError,
  onSuccess,
}: MutationProps<Post>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newPost: Omit<Post, 'id'>) => createPost(newPost),
    onMutate: async newPost => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.posts.all,
      });

      const previousPosts = queryClient.getQueryData<GetPostsResponse>(
        queryKeys.posts.lists()
      );

      // ! 이전 데이터 캐시에 새 게시물 추가하여 UI 낙관적 업데이트 선행
      queryClient.setQueryData(queryKeys.posts.lists(), (old: any) => {
        if (!old) {
          return {
            posts: [newPost],
            total: 1,
            skip: 0,
            limit: 10,
          };
        }

        return {
          ...old,
          posts: [newPost, ...(old.posts || [])],
        };
      });

      return { previousPosts };
    },
    onError: (error, __, context) => {
      queryClient.setQueryData(queryKeys.posts.lists(), context?.previousPosts);
      onError?.(error);
    },
    onSuccess: (data, _, { previousPosts }) => {
      // ! 성공 시 이전 데이터에 성공 데이터 추가
      queryClient.setQueryData(queryKeys.posts.lists(), (old: any) => {
        return {
          ...old,
          posts: [data, ...(previousPosts?.posts || [])],
        };
      });
      onSuccess?.(data);
    },
  });
};

export const usePutPostMutation = ({
  onError,
  onSuccess,
}: MutationProps<Post>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updatedPost: Post) => putPost(updatedPost),
    onMutate: async updatedPost => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.posts.all,
      });

      const previousPosts = queryClient.getQueryData<GetPostsResponse>(
        queryKeys.posts.lists()
      );

      // ! 이전 데이터 캐시에 수정된 게시물 업데이트하여 UI 낙관적 업데이트 선행
      queryClient.setQueryData(queryKeys.posts.lists(), (old: any) => {
        if (!old || !old.posts) {
          return old;
        }
        return {
          ...old,
          posts: old.posts.map((post: Post) =>
            post.id === updatedPost.id ? updatedPost : post
          ),
        };
      });

      return { previousPosts };
    },
    onError: (error, __, context) => {
      queryClient.setQueryData(queryKeys.posts.lists(), context?.previousPosts);
      onError?.(error);
    },
    onSuccess: (data, _, { previousPosts }) => {
      // ! 성공 시 이전 데이터에 성공 데이터 추가
      queryClient.setQueryData(queryKeys.posts.lists(), (old: any) => {
        return {
          ...old,
          posts: [data, ...(previousPosts?.posts || [])],
        };
      });
      onSuccess?.(data);
    },
  });
};

export const useDeletePostMutation = ({
  onError,
  onSuccess,
}: MutationProps<Post>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => deletePost(postId),
    onMutate: async postId => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.posts.all,
      });

      const previousPosts = queryClient.getQueryData<GetPostsResponse>(
        queryKeys.posts.lists()
      );

      // ! 이전 데이터 캐시에 삭제된 게시물 제외하여 UI 낙관적 업데이트 선행
      queryClient.setQueryData(queryKeys.posts.lists(), (old: any) => {
        if (!old || !old.posts) {
          return old;
        }
        return {
          ...old,
          posts: old.posts.filter((post: Post) => post.id !== postId),
        };
      });

      return { previousPosts };
    },

    onError: (error, __, context) => {
      queryClient.setQueryData(queryKeys.posts.lists(), context?.previousPosts);
      onError?.(error);
    },
    onSuccess: (data, _, { previousPosts }) => {
      // ! 성공 시 이전 데이터에 성공 데이터 추가
      queryClient.setQueryData(queryKeys.posts.lists(), (old: any) => {
        return {
          ...old,
          posts: [data, ...(previousPosts?.posts || [])],
        };
      });
      onSuccess?.(data);
    },
  });
};
