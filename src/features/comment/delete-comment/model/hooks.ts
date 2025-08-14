import { useCommentStore } from '../../../../entities/comment/model/store';

export const useDeleteComment = () => {
  const { removeCommentFromPost } = useCommentStore();

  const deleteComment = async (id: number, postId: number) => {
    try {
      await fetch(`/api/comments/${id}`, { method: 'DELETE' });
      removeCommentFromPost(postId, id);
    } catch (error) {
      console.error('댓글 삭제 오류:', error);
    }
  };

  return { deleteComment };
};
