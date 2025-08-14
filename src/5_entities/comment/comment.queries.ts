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
  GetCommentsResponse,
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

      const previousCommentData = queryClient.getQueryData<GetCommentsResponse>(
        queryKeys.comments.list(newComment.postId)
      );

      const commentToAdd: Comment = {
        ...newComment,
        id: Math.floor(Math.random() * 1000000),
        likes: 0,
        user: {
          id: 1,
          username: 'John Doe',
          image: 'john.doe@example.com',
        },
      };

      // ! 이전 데이터 캐시에 새 댓글 추가하여 UI 낙관적 업데이트 선행
      queryClient.setQueryData(
        queryKeys.comments.list(newComment.postId),
        (old: GetCommentsResponse) => {
          return {
            ...old,
            comments: [commentToAdd, ...(old.comments || [])],
          };
        }
      );

      return { previousCommentData };
    },
    onError: (error, { postId }, context) => {
      queryClient.setQueryData(
        queryKeys.comments.list(postId),
        context?.previousCommentData
      );
      onError?.(error);
    },
    onSuccess: (data, _, { previousCommentData }) => {
      // ! 성공 시 이전 데이터에 성공 데이터 추가
      queryClient.setQueryData(
        queryKeys.comments.list(data.postId),
        (old: any) => {
          return {
            ...old,
            comments: [data, ...(previousCommentData?.comments || [])],
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
}: MutationProps<{ body: string }>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updatedComment: Comment) => updateComment(updatedComment),
    onMutate: async updatedComment => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.comments.list(updatedComment.postId),
      });

      const previousComments = queryClient.getQueryData<GetCommentsResponse>(
        queryKeys.comments.list(updatedComment.postId)
      );

      // ! 이전 데이터 캐시에 수정된 댓글 업데이트하여 UI 낙관적 업데이트 선행
      queryClient.setQueryData(
        queryKeys.comments.list(updatedComment.postId),
        (old: GetCommentsResponse) => {
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
        }
      );

      return { previousComments };
    },
    onError: (error, updatedComment, context) => {
      queryClient.setQueryData(
        queryKeys.comments.list(updatedComment.postId),
        context?.previousComments
      );
      onError?.(error);
    },
    onSuccess: (data, updatedComment, { previousComments }) => {
      // ! 성공 시 이전 데이터에 성공 데이터 추가
      queryClient.setQueryData(
        queryKeys.comments.list(updatedComment.postId),
        (old: any) => {
          return {
            ...old,
            comments: previousComments?.comments.map((comment: Comment) =>
              comment.id === updatedComment.id
                ? { ...comment, body: data.body }
                : comment
            ),
          };
        }
      );
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
    mutationFn: ({ commentId }: { commentId: number; postId: number }) =>
      deleteComment(commentId),
    onMutate: async ({ commentId, postId }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.comments.list(postId),
      });

      const previousComments = queryClient.getQueryData<GetCommentsResponse>(
        queryKeys.comments.list(postId)
      );

      // ! 이전 데이터 캐시에 삭제된 댓글 제외하여 UI 낙관적 업데이트 선행
      queryClient.setQueryData(queryKeys.comments.list(postId), (old: any) => {
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
    onError: (error, { postId }, context) => {
      queryClient.setQueryData(
        queryKeys.comments.list(postId),
        context?.previousComments
      );
      onError?.(error);
    },
    onSuccess: (data, { postId }, { previousComments }) => {
      // ! 성공 시 이전 데이터에서 삭제된 댓글 제외
      queryClient.setQueryData(queryKeys.comments.list(postId), (old: any) => {
        return {
          ...old,
          comments: previousComments?.comments.filter(
            (comment: Comment) => comment.id !== data.id
          ),
        };
      });
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
      const commentsData = queryClient.getQueryData<GetCommentsResponse>(
        queryKeys.comments.list(postId)
      );

      if (!commentsData) {
        throw new Error('Comments not found');
      }

      const commentToUpdate = commentsData.comments.find(
        (comment: Comment) => comment.id === commentId
      );

      if (!commentToUpdate) {
        throw new Error('Comment not found');
      }

      return patchComment(
        {
          likes: commentToUpdate.likes + 1,
        },
        commentId
      );
    },
    onMutate: async ({ commentId, postId }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.comments.list(postId),
      });

      const previousComments = queryClient.getQueryData<GetCommentsResponse>(
        queryKeys.comments.list(postId)
      );

      // ! 이전 데이터 캐시에 좋아요 누른 댓글 업데이트하여 UI 낙관적 업데이트 선행
      queryClient.setQueryData(
        queryKeys.comments.list(postId),
        (old: GetCommentsResponse) => {
          if (!old) {
            return {
              comments: [],
              total: 0,
              skip: 0,
              limit: 10,
            };
          }

          return {
            ...old,
            comments: old.comments.map((comment: Comment) =>
              comment.id === commentId
                ? { ...comment, likes: comment.likes + 1 }
                : comment
            ),
          };
        }
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
    onSuccess: (data, _, { previousComments }) => {
      // ! 성공 시 이전 데이터에 좋아요 누른 댓글 업데이트
      // ! 실무에선 응답 데이터의 좋아요 수가 증가해야하지만, 더미 데이터라 증가하지 않으므로 좋아요수가 증가한 것으로 가정하여 업데이트
      queryClient.setQueryData(queryKeys.comments.list(data.postId), () => {
        return {
          ...previousComments,
          comments: previousComments?.comments.map((comment: Comment) =>
            comment.id === data.id
              ? { ...data, likes: comment.likes + 1 }
              : comment
          ),
        };
      });
      onSuccess?.(data);
    },
  });
};
