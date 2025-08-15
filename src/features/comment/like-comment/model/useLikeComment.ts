import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IComment, IComments } from '../../../../entities/comment/model/type';
import { commentModel } from '../../../../entities/comment/model/store';
import { likeCommentApi } from '../../../../entities/comment/api/comment-api';

export const useLikeComment = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (comment: IComment) =>
      likeCommentApi(comment.id, comment.likes + 1),

    onSuccess: (_, comment) => {
      const likedComment = {
        ...comment,
        likes: comment.likes + 1,
      };

      queryClient.setQueryData<IComments>(
        ['comments', likedComment.postId],
        (prev) => {
          if (!prev) return prev;
          return commentModel.likeComment(prev, likedComment);
        }
      );
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
