import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteComment, postComment, putComment, patchLikeComment } from './index';

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postComment,
    onSuccess: () => {
      console.log('useCreateComment onSuccess');
      queryClient.invalidateQueries({ queryKey: ['comments'] });
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
