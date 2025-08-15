import { Comment, NewComment } from '../../../entities/comment';
import * as commentAPI from '../../../entities/comment/api';

// 상태 관리와 결합된 API 로직
export const useCommentAPI = () => {
  // 댓글 가져오기
  const fetchCommentsWithState = async (
    postId: number,
    comments: Record<number, Comment[]>,
    setComments: (comments: Record<number, Comment[]>) => void,
  ) => {
    if (comments[postId]) return; // 이미 불러온 댓글이 있으면 다시 불러오지 않음
    try {
      const data = await commentAPI.fetchComments(postId);
      const updatedComments = { ...comments, [postId]: data.comments };
      setComments(updatedComments);
    } catch (error) {
      console.error('댓글 가져오기 오류:', error);
    }
  };

  // 댓글 추가
  const addCommentWithState = async (
    setComments: (comments: Record<number, Comment[]>) => void,
    comments: Record<number, Comment[]>,
    setShowAddCommentDialog: (show: boolean) => void,
    setNewComment: (comment: NewComment) => void,
    newComment: NewComment,
  ) => {
    try {
      const data = await commentAPI.addComment(newComment);
      
      const updatedComments = {
        ...comments,
        [data.postId]: [...(comments[data.postId] || []), data],
      };
      
      setComments(updatedComments);
      setShowAddCommentDialog(false);
      setNewComment({ body: '', postId: null, userId: 1 });
    } catch (error) {
      console.error('댓글 추가 오류:', error);
    }
  };

  // 댓글 업데이트
  const updateCommentWithState = async (
    setComments: (comments: Record<number, Comment[]>) => void,
    comments: Record<number, Comment[]>,
    setShowEditCommentDialog: (show: boolean) => void,
    selectedComment: Comment,
  ) => {
    try {
      const data = await commentAPI.updateComment(selectedComment.id, selectedComment.body);
      
      const updatedComments = {
        ...comments,
        [data.postId]: comments[data.postId].map((comment) =>
          comment.id === data.id ? data : comment,
        ),
      };

      setComments(updatedComments);
      setShowEditCommentDialog(false);
    } catch (error) {
      console.error('댓글 업데이트 오류:', error);
    }
  };

  // 댓글 삭제
  const deleteCommentWithState = async (
    setComments: (comments: Record<number, Comment[]>) => void,
    comments: Record<number, Comment[]>,
    id: number,
    postId: number,
  ) => {
    try {
      await commentAPI.deleteComment(id);
      
      const updatedComments = {
        ...comments,
        [postId]: comments[postId].filter((comment) => comment.id !== id),
      };

      setComments(updatedComments);
    } catch (error) {
      console.error('댓글 삭제 오류:', error);
    }
  };

  // 댓글 좋아요
  const likeCommentWithState = async (
    setComments: (comments: Record<number, Comment[]>) => void,
    comments: Record<number, Comment[]>,
    id: number,
    postId: number,
  ) => {
    try {
      const currentComment = comments[postId]?.find((c) => c.id === id);
      if (!currentComment) return;

      const data = await commentAPI.likeComment(id, currentComment.likes);
      
      const updatedComments = {
        ...comments,
        [postId]: comments[postId].map((comment) =>
          comment.id === data.id ? { ...data, likes: comment.likes + 1 } : comment,
        ),
      };

      setComments(updatedComments);
    } catch (error) {
      console.error('댓글 좋아요 오류:', error);
    }
  };

  return {
    fetchCommentsWithState,
    addCommentWithState,
    updateCommentWithState,
    deleteCommentWithState,
    likeCommentWithState,
  };
};
