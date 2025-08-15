import { IAddCommentResponse, IComment, IComments } from './type';

export const commentModel = {
  /**
   * 댓글 추가
   */
  addComment: (commentData: IComments, newComment: IComment): IComments => {
    return {
      ...commentData,
      comments: [newComment, ...commentData.comments],
    };
  },

  /**
   * 댓글 업데이트
   */
  updateComment: (
    commentData: IComments,
    updatedComment: IComment
  ): IComments => {
    return {
      ...commentData,
      comments: commentData.comments.map((comment) =>
        comment.id === updatedComment.id ? updatedComment : comment
      ),
    };
  },

  /**
   * 댓글 삭제
   */
  deleteComment: (commentData: IComments, comment: IComment): IComments => {
    return {
      ...commentData,
      comments: commentData.comments.filter((c) => c.id !== comment.id),
    };
  },

  /**
   *댓글 좋아요
   */
  likeComment: (
    commentData: IComments,
    updatedComment: IComment
  ): IComments => {
    return {
      ...commentData,
      comments: commentData.comments.map((comment) =>
        comment.id === updatedComment.id
          ? { ...updatedComment, likes: updatedComment.likes }
          : comment
      ),
    };
  },

  /**
   * 댓글 작성 응답 데이터를 IComment 타입 객체로 변환
   */
  addResponseToComment: (res: IAddCommentResponse): IComment => {
    return {
      ...res,
      likes: 0,
    };
  },
};
