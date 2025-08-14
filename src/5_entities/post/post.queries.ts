import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/shared/lib';
import { useCachedPostsQueryKey } from '@/shared/lib/hooks/useCachedPostsQueryKey';
import { MutationProps } from '@/shared/types';

import {
  createPost,
  deletePost,
  getPosts,
  getPostsBySearch,
  getPostsByTag,
  putPost,
} from './post.api';
import {
  BaseFilterParams,
  GetPostsResponse,
  ParamsWithSearch,
  ParamsWithTag,
  Post,
} from './post.type';

export const useGetPostsQuery = (params: BaseFilterParams) => {
  return useQuery({
    queryKey: queryKeys.posts.list(params),
    queryFn: () => getPosts(params),
  });
};

export const useGetPostsByTagQuery = (params: ParamsWithTag) => {
  return useQuery({
    queryKey: queryKeys.posts.list(params),
    queryFn: () => getPostsByTag(params),
    enabled: !!params.selectedTag && params.selectedTag !== 'all',
  });
};

export const useGetPostsBySearchQuery = (params: ParamsWithSearch) => {
  return useQuery({
    queryKey: queryKeys.posts.list(params),
    queryFn: () => getPostsBySearch(params),
    enabled: !!params.searchQuery && params.searchQuery.trim() !== '',
  });
};

export const useCreatePostMutation = ({
  onError,
  onSuccess,
}: MutationProps<Post>) => {
  const queryClient = useQueryClient();
  const cachedPostsQueryKey = useCachedPostsQueryKey();

  return useMutation({
    mutationFn: (newPost: Omit<Post, 'id'>) => createPost(newPost),
    onMutate: async newPost => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.posts.all,
      });

      const previousPosts =
        queryClient.getQueryData<GetPostsResponse>(cachedPostsQueryKey);

      // ! 이전 데이터 캐시에 새 게시물 추가하여 UI 낙관적 업데이트 선행
      queryClient.setQueryData(cachedPostsQueryKey, (old: any) => {
        const postToAdd: Post = {
          ...newPost,
          id: previousPosts?.total ? previousPosts.total + 1 : 1,
        };

        if (!old) {
          return {
            posts: [postToAdd],
            total: 1,
            skip: 0,
            limit: 10,
          };
        }

        return {
          ...old,
          posts: [postToAdd, ...(old.posts || [])],
        };
      });

      return { previousPosts };
    },
    onError: (error, __, context) => {
      queryClient.setQueryData(cachedPostsQueryKey, context?.previousPosts);
      onError?.(error);
    },
    onSuccess: (data, _, { previousPosts }) => {
      // ! 성공 시 이전 데이터에 성공 데이터 추가
      queryClient.setQueryData(cachedPostsQueryKey, (old: any) => {
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
  const cachedPostsQueryKey = useCachedPostsQueryKey();

  return useMutation({
    mutationFn: (updatedPost: Post) => putPost(updatedPost),
    onMutate: async updatedPost => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.posts.all,
      });

      const previousPosts =
        queryClient.getQueryData<GetPostsResponse>(cachedPostsQueryKey);

      // ! 이전 데이터 캐시에 수정된 게시물 업데이트하여 UI 낙관적 업데이트 선행
      queryClient.setQueryData(cachedPostsQueryKey, (old: any) => {
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
      queryClient.setQueryData(cachedPostsQueryKey, context?.previousPosts);
      onError?.(error);
    },
    onSuccess: (data, updatedPost, { previousPosts }) => {
      // ! 성공 시 이전 데이터에 성공 데이터로 수정
      queryClient.setQueryData(cachedPostsQueryKey, (old: any) => {
        return {
          ...old,
          posts: previousPosts?.posts.map((post: Post) =>
            post.id === updatedPost.id ? updatedPost : post
          ),
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
  const cachedPostsQueryKey = useCachedPostsQueryKey();

  return useMutation({
    mutationFn: (postId: number) => deletePost(postId),
    onMutate: async postId => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.posts.all,
      });

      const previousPosts =
        queryClient.getQueryData<GetPostsResponse>(cachedPostsQueryKey);

      // ! 이전 데이터 캐시에 삭제된 게시물 제외하여 UI 낙관적 업데이트 선행
      queryClient.setQueryData(cachedPostsQueryKey, (old: any) => {
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
      queryClient.setQueryData(cachedPostsQueryKey, context?.previousPosts);
      onError?.(error);
    },
    onSuccess: data => {
      onSuccess?.(data);
    },
  });
};
