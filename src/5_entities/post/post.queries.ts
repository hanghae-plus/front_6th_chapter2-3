import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/shared/lib';

import {
  createPost,
  deletePost,
  getPosts,
  getPostsBySearch,
  getPostsByTag,
  GetPostsParams,
  putPost,
} from './post.api';
import { Post } from './post.type';

export const useGetPostsQuery = (params: GetPostsParams) => {
  return useQuery({
    queryKey: queryKeys.posts.lists(),
    queryFn: () => getPosts(params),
  });
};

export const useGetPostsByTagQuery = (tag: string) => {
  return useQuery({
    queryKey: queryKeys.posts.lists(),
    queryFn: () => getPostsByTag({ tag }),
    enabled: !!tag && tag !== 'all',
  });
};

export const useGetPostsBySearchQuery = (search: string) => {
  return useQuery({
    queryKey: queryKeys.posts.lists(),
    queryFn: () => getPostsBySearch({ search }),
    enabled: !!search && search.trim() !== '',
  });
};

interface MutationProps {
  onError?: (error: Error) => void;
  onSuccess?: (data: Post) => void;
}

export const useCreatePostMutation = ({
  onError,
  onSuccess,
}: MutationProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newPost: Omit<Post, 'id'>) => createPost(newPost),
    onMutate: async newPost => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.posts.all,
      });

      const previousPosts = queryClient.getQueryData(queryKeys.posts.lists());

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
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      onSuccess?.(data);
    },
  });
};

export const usePutPostMutation = ({ onError, onSuccess }: MutationProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updatedPost: Post) => putPost(updatedPost),
    onMutate: async updatedPost => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.posts.all,
      });

      const previousPosts = queryClient.getQueryData(queryKeys.posts.lists());

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
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      onSuccess?.(data);
    },
  });
};

export const useDeletePostMutation = ({
  onError,
  onSuccess,
}: MutationProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => deletePost(postId),
    onMutate: async postId => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.posts.all,
      });

      const previousPosts = queryClient.getQueryData(queryKeys.posts.lists());

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
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      onSuccess?.(data);
    },
  });
};
