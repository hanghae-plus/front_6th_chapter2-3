import { IComment, ICommentsByPostId } from './type';

export const commentModel = {
  /**
   * 특정 게시물 댓글 추가
   */
  addComment: (
    comments: ICommentsByPostId,
    newComment: IComment
  ): ICommentsByPostId => {
    const postId = newComment.postId;

    return {
      ...comments,
      [postId]: [...(comments[postId] || []), newComment],
    };
  },

  /**
   * 특정 게시물 댓글 업데이트
   */
  updateComment: (
    comments: ICommentsByPostId,
    updatedComment: IComment
  ): ICommentsByPostId => {
    const { id, postId } = updatedComment;

    return {
      ...comments,
      [postId]: comments[postId].map((comment) =>
        comment.id === id ? updatedComment : comment
      ),
    };
  },

  /**
   * 특정 게시물 댓글 삭제
   */
  deleteComment: (
    comments: ICommentsByPostId,
    id: number,
    postId: number
  ): ICommentsByPostId => {
    return {
      ...comments,
      [postId]: comments[postId].filter((comment) => comment.id !== id),
    };
  },

  /**
   * 특정 게시물 댓글 좋아요
   */
  likeComment: (
    comments: ICommentsByPostId,
    updatedComment: IComment
  ): ICommentsByPostId => {
    const { id, postId } = updatedComment;

    return {
      ...comments,
      [postId]: comments[postId].map((comment) =>
        comment.id === id
          ? { ...updatedComment, likes: comment.likes + 1 }
          : comment
      ),
    };
  },

  /**
   * 특정 게시물 댓글 목록에서 아이디로 댓글 추출
   */
  findCommentById: (
    commentsByPostId: ICommentsByPostId,
    postId: number,
    commentId: number
  ): IComment | undefined => {
    return commentsByPostId[postId]?.find((c) => c.id === commentId);
  },
};
