import { useCommentStore } from '../../../../entities/comment/model/store';

export const updateComment = async () => {
  const { selectedComment, setComments } = useCommentStore.getState();

  if (!selectedComment) {
    throw new Error('선택된 댓글이 없습니다');
  }

  try {
    const response = await fetch(`/api/comments/${selectedComment.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: selectedComment.body }),
    });

    if (!response.ok) throw new Error('댓글 수정 실패');

    const data = await response.json();
    const currentComments = useCommentStore.getState().comments;

    setComments({
      ...currentComments,
      [data.postId]: currentComments[data.postId].map((comment) =>
        comment.id === data.id ? data : comment,
      ),
    });

    return data;
  } catch (error) {
    console.error('댓글 업데이트 오류:', error);
    throw error;
  }
};
