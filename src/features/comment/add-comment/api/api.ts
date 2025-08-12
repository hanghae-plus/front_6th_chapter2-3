import { useCommentStore } from '../../../../entities/comment/model/store';

export const addComment = async () => {
  const { newComment, setComments, setNewComment } = useCommentStore.getState();

  try {
    const response = await fetch('/api/comments/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newComment),
    });

    if (!response.ok) throw new Error('댓글 추가 실패');

    const data = await response.json();
    const currentComments = useCommentStore.getState().comments;

    setComments({
      ...currentComments,
      [data.postId]: [...(currentComments[data.postId] || []), data],
    });

    setNewComment({ body: '', postId: null, userId: 1 });
    return data;
  } catch (error) {
    console.error('댓글 추가 오류:', error);
    throw error;
  }
};
