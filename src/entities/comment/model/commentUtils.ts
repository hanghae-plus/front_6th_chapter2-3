import { Comment, NewComment } from '../types';

// 댓글 추가 시 postId 설정
export const handleAddCommentWithPostId = (
  selectedPost: any,
  newComment: NewComment,
  setNewComment: (comment: NewComment) => void,
  handleAddCommentWithData: (commentData: NewComment) => void,
) => {
  if (selectedPost) {
    const updatedComment = {
      ...newComment,
      postId: selectedPost.id,
      userId: newComment.userId || 1,
    };
    setNewComment(updatedComment);
    handleAddCommentWithData(updatedComment);
  }
};

// 특정 데이터로 댓글 추가하는 함수
export const handleAddCommentWithData = (
  commentData: NewComment,
  setShowAddCommentDialog: (show: boolean) => void,
  setNewComment: (comment: NewComment) => void,
) => {
  // 이 함수는 실제로는 features/comment/api에서 처리되어야 함
  // 여기서는 비즈니스 로직만 담당
  if (commentData.postId) {
    setShowAddCommentDialog(false);
    setNewComment({ body: '', postId: null, userId: 1 });
  }
};
