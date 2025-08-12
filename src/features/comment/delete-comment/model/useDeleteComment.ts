import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCommentApi } from '../../../../entities/comment/api/comment-api';
import { IComment, IComments } from '../../../../entities/comment/model/type';
import { commentModel } from '../../../../entities/comment/model/store';

export const useDeleteComment = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (comment: IComment) => deleteCommentApi(comment.id),

    onSuccess: (_, comment) => {
      queryClient.setQueryData<IComments>(
        ['comments', comment.postId],
        (prev) => {
          if (!prev) return prev;
          return commentModel.deleteComment(prev, comment);
        }
      );

      onSuccess?.();
    },
    onError: (error) => {
      console.error('댓글 삭제 오류:', error);
    },
  });

  return {
    deleteComment: mutation.mutate,
  };
};
