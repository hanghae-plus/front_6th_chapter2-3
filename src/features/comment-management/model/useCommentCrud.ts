
import {
  CreateComment,
  UpdateComment,
  commentApi,
} from '../../../entities/comment';
import { useCommentState } from './useCommentState';

export const useCommentCrud = () => {
  const {
    comments,
    setComments,
    addCommentToPost,
    updateCommentInPost,
    removeCommentFromPost,
    setLoading,
  } = useCommentState();

  const fetchComments = async (postId: number) => {
    if (comments[postId]) return; // 이미 불러온 댓글이 있으면 다시 불러오지 않음

    setLoading(true);
    try {
      const data = await commentApi.getCommentsByPost(postId);
      setComments(postId, data.comments);
    } catch (error: any) {
      console.error('댓글 가져오기 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (comment: CreateComment) => {
    try {
      const data = await commentApi.addComment(comment);
      addCommentToPost(data.postId, data);
    } catch (error: any) {
      console.error('댓글 추가 오류:', error);
    }
  };

  const updateComment = async (id: number, comment: UpdateComment) => {
    try {
      const data = await commentApi.updateComment(id, comment);
      updateCommentInPost(data.postId, data.id, data);
    } catch (error: any) {
      console.error('댓글 수정 오류:', error);
    }
  };

  const deleteComment = async (id: number, postId: number) => {
    try {
      await commentApi.deleteComment(id);
      removeCommentFromPost(postId, id);
    } catch (error: any) {
      console.error('댓글 삭제 오류:', error);
    }
  };

  const likeComment = async (id: number, postId: number) => {
    try {
      const currentComments = comments[postId];
      const comment = currentComments.find(c => c.id === id);
      if (!comment) return;

      const data = await commentApi.likeComment(id);
      updateCommentInPost(postId, data.id, {
        ...data,
        likes: comment.likes + 1,
      });
    } catch (error: any) {
      console.error('댓글 좋아요 오류:', error);
    }
  };

  return {
    comments,
    fetchComments,
    addComment,
    updateComment,
    deleteComment,
    likeComment,
  };
};
