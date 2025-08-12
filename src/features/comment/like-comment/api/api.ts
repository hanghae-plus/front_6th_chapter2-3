import { useCommentStore } from '../../../../entities/comment/model/store';

export const likeComment = async (id: number, postId: number) => {
  const { setComments } = useCommentStore.getState();

  try {
    const currentComments = useCommentStore.getState().comments;
    const currentComment = currentComments[postId].find((c) => c.id === id);

    if (!currentComment) {
      throw new Error('댓글을 찾을 수 없습니다');
    }

    const response = await fetch(`/api/comments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ likes: currentComment.likes + 1 }),
    });

    if (!response.ok) throw new Error('댓글 좋아요 실패');

    const data = await response.json();

    setComments({
      ...currentComments,
      [postId]: currentComments[postId].map((comment) =>
        comment.id === data.id ? { ...data, likes: comment.likes + 1 } : comment,
      ),
    });

    return data;
  } catch (error) {
    console.error('댓글 좋아요 오류:', error);
    throw error;
  }
};
