import { useMutation } from '@tanstack/react-query';
import { deleteCommentApi } from '../../../../entities/comment/api/comment-api';

export const useDeleteComment = (onSuccess?: (deletedId: number) => void) => {
  const mutation = useMutation({
    mutationFn: (id: number) => deleteCommentApi(id),

    onSuccess: (_, id) => {
      onSuccess?.(id);
    },
    onError: (error) => {
      console.error('댓글 삭제 오류:', error);
    },
  });

  return {
    deleteComment: mutation.mutate,
  };
};
