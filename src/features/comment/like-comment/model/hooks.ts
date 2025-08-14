import { useCommentStore } from '../../../../entities/comment/model/store';

export const useLikeComment = () => {
  const { comments, updateCommentInPost } = useCommentStore();

  const likeComment = async (id: number, postId: number) => {
    try {
      const currentComment = comments[postId]?.find((c) => c.id === id);
      if (!currentComment) return;

      const response = await fetch(`/api/comments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ likes: currentComment.likes + 1 }),
      });
      const data = await response.json();
      updateCommentInPost(postId, id, { ...data, likes: currentComment.likes + 1 });
    } catch (error) {
      console.error('댓글 좋아요 오류:', error);
    }
  };

  return { likeComment };
};
