import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/shared/index';
import { MutationProps, Nullable } from '@/shared/types';

import {
  createComment,
  deleteComment,
  getComments,
  patchComment,
  updateComment,
} from './comment.api';
import {
  Comment,
  CommentToCreate,
  CreatedComment,
  DeletedComment,
} from './comment.type';

export const useGetCommentsQuery = (postId: Nullable<number>) => {
  return useQuery({
    queryKey: queryKeys.comments.list(postId ?? 0),
    queryFn: () => getComments(postId ?? 0),
    enabled: !!postId,
  });
};

export const useCreateCommentMutation = ({
  onError,
  onSuccess,
}: MutationProps<CreatedComment>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newComment: CommentToCreate) => createComment(newComment),
    onMutate: async newComment => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.comments.list(newComment.postId),
      });

      const previousComments = queryClient.getQueryData(
        queryKeys.comments.list(newComment.postId)
      );

      return { previousComments };
    },
    onError: (error, { postId }, context) => {
      queryClient.setQueryData(
        queryKeys.comments.list(postId),
        context?.previousComments
      );
      onError?.(error);
    },
    onSuccess: data => {
      queryClient.setQueryData(
        queryKeys.comments.list(data.postId),
        (old: any) => {
          return {
            ...old,
            comments: [data, ...(old.comments || [])],
          };
        }
      );
      onSuccess?.(data);
    },
  });
};

export const useUpdateCommentMutation = ({
  onError,
  onSuccess,
}: MutationProps<Comment>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updatedComment: Comment) => updateComment(updatedComment),
    onMutate: async updatedComment => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.comments.lists(),
      });

      const previousComments = queryClient.getQueryData(
        queryKeys.comments.lists()
      );

      queryClient.setQueryData(queryKeys.comments.lists(), (old: any) => {
        if (!old) {
          return {
            comments: [updatedComment],
            total: 1,
            skip: 0,
            limit: 10,
          };
        }

        return {
          ...old,
          comments: old.comments.map((comment: Comment) =>
            comment.id === updatedComment.id ? updatedComment : comment
          ),
        };
      });

      return { previousComments };
    },
    onError: (error, __, context) => {
      queryClient.setQueryData(
        queryKeys.comments.lists(),
        context?.previousComments
      );
      onError?.(error);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: queryKeys.comments.lists() });
      onSuccess?.(data);
    },
  });
};

export const useDeleteCommentMutation = ({
  onError,
  onSuccess,
}: MutationProps<DeletedComment>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => deleteComment(commentId),
    onMutate: async commentId => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.comments.lists(),
      });

      const previousComments = queryClient.getQueryData(
        queryKeys.comments.lists()
      );

      queryClient.setQueryData(queryKeys.comments.lists(), (old: any) => {
        if (!old) {
          return {
            comments: [],
            total: 1,
            skip: 0,
            limit: 10,
          };
        }

        return {
          ...old,
          comments: old.comments.filter(
            (comment: Comment) => comment.id !== commentId
          ),
        };
      });

      return { previousComments };
    },
    onError: (error, __, context) => {
      queryClient.setQueryData(
        queryKeys.comments.lists(),
        context?.previousComments
      );
      onError?.(error);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: queryKeys.comments.lists() });
      onSuccess?.(data);
    },
  });
};

export const useLikeCommentMutation = ({
  onError,
  onSuccess,
}: MutationProps<Comment>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      commentId,
      postId,
    }: {
      commentId: number;
      postId: number;
    }) => {
      const comments = queryClient.getQueryData<Comment[]>(
        queryKeys.comments.list(postId)
      );

      if (!comments) {
        throw new Error('Comments not found');
      }

      const commentToUpdate = comments.find(
        (comment: Comment) => comment.id === commentId
      );

      if (!commentToUpdate) {
        throw new Error('Comment not found');
      }

      return patchComment({
        ...commentToUpdate,
        likes: commentToUpdate.likes + 1,
      });
    },
    onMutate: async ({ commentId, postId }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.comments.list(postId),
      });

      const previousComments = queryClient.getQueryData(
        queryKeys.comments.list(postId)
      );

      queryClient.setQueryData(queryKeys.comments.list(postId), (old: any) => {
        return old.map((comment: Comment) =>
          comment.id === commentId
            ? { ...comment, likes: comment.likes + 1 }
            : comment
        );
      });

      return { previousComments };
    },
    onError: (error, { postId }, context) => {
      queryClient.setQueryData(
        queryKeys.comments.list(postId),
        context?.previousComments
      );
      onError?.(error);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.list(data.postId),
      });
      onSuccess?.(data);
    },
  });
};
