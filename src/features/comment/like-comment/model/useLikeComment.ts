import { IComment } from '../../../../entities/comment/model/type';
import { likeCommentApi } from '../../../../entities/comment/api/comment-api';

export const useLikeComment = (
  comment: IComment,
  onSuccess?: (updatedComment: IComment) => void
) => {
  const likeComment = async () => {
    try {
      const updatedComment = await likeCommentApi(
        comment.id,
        comment.likes + 1
      );
      onSuccess?.(updatedComment);
    } catch (error) {
      console.error('댓글 좋아요 오류:', error);
    }
  };

  return { likeComment };
};
