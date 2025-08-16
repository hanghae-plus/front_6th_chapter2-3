import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteComment, postComment, putComment, patchLikeComment } from './index';

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postComment,
    onSuccess: (response, { postId, body, userId }) => {
      // 특정 게시물의 댓글 캐시에 새 댓글을 맨 아래에 추가
      queryClient.setQueriesData({ queryKey: ['comments', postId] }, (oldData: any) => {
        if (!oldData?.comments) return oldData;

        // 새로운 댓글을 맨 아래에 추가
        const newComment = {
          id: response.id || Date.now(),
          body,
          likes: 0, // 초기 좋아요 수
          postId,
          user: {
            id: userId,
            username: `User ${userId}`,
            fullName: `User ${userId}`,
          },
          ...response,
        };

        return {
          ...oldData,
          comments: [...oldData.comments, newComment], // 맨 아래에 추가
        };
      });

      console.log('댓글 추가 성공', response);
    },
    onError: (error) => {
      console.error('댓글 추가 오류:', error);
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: putComment,
    onSuccess: (response) => {
      console.log('useUpdateComment onSuccess> ', response);
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComment,
    onSuccess: (response, { postId }) => {
      // 특정 게시물의 댓글만 무효화
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      console.log('댓글 삭제 성공', response);
    },
    onError: (error) => {
      console.error('댓글 삭제 오류:', error);
    },
  });
};

export const useLikeComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchLikeComment,
    onSuccess: (response, { postId }) => {
      // 특정 게시물의 댓글만 무효화
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      console.log('댓글 좋아요 성공', response);
    },
    onError: (error) => {
      console.error('댓글 좋아요 오류:', error);
    },
  });
};
