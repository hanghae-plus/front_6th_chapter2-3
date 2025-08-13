import {
  getPostComments,
  getPosts,
  getPostsTags,
  patchPostCommentLike,
} from './remote';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { PostCommentsResponse } from '../model';
import { QUERY_KEYS, queryClient } from '@/shared/config';

export const usePosts = (
  limit: number,
  skip: number,
  searchQuery: string = '',
  selectedTag: string = '',
) => {
  return useQuery({
    queryKey: QUERY_KEYS.posts(limit, skip, searchQuery, selectedTag),
    queryFn: () => getPosts(limit, skip, searchQuery, selectedTag),
  });
};

export const usePostsTags = () => {
  return useQuery({
    queryKey: QUERY_KEYS.postsTags(),
    queryFn: () => getPostsTags(),
  });
};

export const usePostComments = (postId?: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.postComments(postId!),
    enabled: !!postId,
    queryFn: () => getPostComments(postId!),
  });
};

export const usePostCommentLike = () => {
  return useMutation({
    mutationFn: ({
      commentId,
      postId,
    }: {
      commentId: number;
      postId: number;
    }) => {
      const previousComments: PostCommentsResponse | undefined =
        queryClient.getQueryData(QUERY_KEYS.postComments(postId));

      const likes = previousComments?.comments?.find(
        (comment) => comment.id === commentId,
      )?.likes;

      if (typeof likes !== 'number') {
        throw new Error('Likes not found');
      }

      return patchPostCommentLike(commentId, likes);
    },
    onMutate: async ({ commentId, postId }) => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.postComments(postId),
      });

      const previousComments = queryClient.getQueryData(
        QUERY_KEYS.postComments(postId),
      );

      queryClient.setQueryData(
        QUERY_KEYS.postComments(postId),
        (old: PostCommentsResponse) => {
          return {
            ...old,
            comments: old.comments.map((comment) =>
              comment.id === commentId
                ? { ...comment, likes: comment.likes + 1 }
                : comment,
            ),
          };
        },
      );

      return { previousComments };
    },
  });
};
