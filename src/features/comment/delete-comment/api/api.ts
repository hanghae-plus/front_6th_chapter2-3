import { useCommentStore } from '../../../../entities/comment/model/store';

export const deleteComment = async (id: number, postId: number) => {
  const { setComments } = useCommentStore.getState();

  try {
    const response = await fetch(`/api/comments/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('댓글 삭제 실패');

    const currentComments = useCommentStore.getState().comments;

    setComments({
      ...currentComments,
      [postId]: currentComments[postId].filter((comment) => comment.id !== id),
    });
  } catch (error) {
    console.error('댓글 삭제 오류:', error);
    throw error;
  }
};
