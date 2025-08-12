import { useMutation } from '@tanstack/react-query';
import { likeCommentApi } from '../../../../entities/comment/api/comment-api';
import { IComment } from '../../../../entities/comment/model/type';

export const useLikeComment = (
  onSuccess?: (updatedComment: IComment) => void
) => {
  const mutation = useMutation({
    mutationFn: (comment: IComment) =>
      likeCommentApi(comment.id, comment.likes + 1),

    onSuccess: (updatedComment) => {
      onSuccess?.(updatedComment);
    },
    onError: (error) => {
      console.error('댓글 좋아요 오류:', error);
    },
  });

  const likeComment = (comment: IComment) => {
    mutation.mutate(comment);
  };

  return { likeComment };
};
