import { deleteCommentApi } from '../../../../entities/comment/api/comment-api';

export const useDeleteComment = (onSuccess?: (deletedId: number) => void) => {
  const deleteComment = async (id: number) => {
    try {
      await deleteCommentApi(id);

      // 댓글 삭제 성공 후 처리
      //   setComments((prev) => ({
      //     ...prev,
      //     [postId]: prev[postId].filter((comment) => comment.id !== id),
      //   }));
      onSuccess?.(id);
    } catch (error) {
      console.error('댓글 삭제 오류:', error);
    }
  };

  return { deleteComment };
};
