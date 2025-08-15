import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteComment, postComment, putComment } from './index';

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
    onSuccess: () => {
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
