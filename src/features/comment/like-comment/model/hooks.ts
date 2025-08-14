import { useCommentStore } from '../../../../entities/comment/model/store';
import { likeCommentAPI } from '../api/api';

export const useLikeComment = () => {
  const { comments, updateCommentInPost } = useCommentStore();

  const likeComment = async (id: number, postId: number) => {
    try {
      const currentComment = comments[postId]?.find((c) => c.id === id);
      if (!currentComment) return;

      const data = await likeCommentAPI(id, currentComment.likes);
      updateCommentInPost(postId, id, { ...data, likes: currentComment.likes + 1 });
    } catch (error) {
      console.error('댓글 좋아요 오류:', error);
    }
  };

  return { likeComment };
};
