import { useCommentStore } from '../../../../entities/comment/model/store';
import { deleteCommentAPI } from '../api/api';

export const useDeleteComment = () => {
  const { removeCommentFromPost } = useCommentStore();

  const deleteComment = async (id: number, postId: number) => {
    try {
      await deleteCommentAPI(id);
      removeCommentFromPost(postId, id);
    } catch (error) {
      console.error('댓글 삭제 오류:', error);
    }
  };

  return { deleteComment };
};
