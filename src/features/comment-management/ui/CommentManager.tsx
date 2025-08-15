import React, { useEffect } from 'react';

import { CommentList } from '../../../entities/comment';
import { usePostSearch } from '../../post-search';
import { useCommentDialogs, useCommentManagement } from '../model';

interface CommentManagerProps {
  postId: number;
}

const CommentManager: React.FC<CommentManagerProps> = ({ postId }) => {
  const {
    fetchComments,
    getCommentsForPost,
    deleteComment,
    likeComment,
    loading,
  } = useCommentManagement();

  const { openAddDialog, openEditDialog } = useCommentDialogs();
  const { searchQuery } = usePostSearch();

  const comments = getCommentsForPost(postId);

  useEffect(() => {
    fetchComments(postId);
  }, [fetchComments, postId]);

  const handleAddComment = () => {
    openAddDialog(postId);
  };

  const handleEditComment = (comment: any) => {
    openEditDialog(comment, postId);
  };

  const handleDeleteComment = async (
    commentId: number,
    postIdParam: number
  ) => {
    if (window.confirm('이 댓글을 삭제하시겠습니까?')) {
      try {
        await deleteComment(commentId, postIdParam);
      } catch (error) {
        console.error('댓글 삭제 실패:', error);
      }
    }
  };

  const handleLikeComment = async (commentId: number, postIdParam: number) => {
    try {
      await likeComment(commentId, postIdParam);
    } catch (error) {
      console.error('댓글 좋아요 실패:', error);
    }
  };

  if (loading && comments.length === 0) {
    return <div className='p-4 text-center'>댓글을 불러오는 중...</div>;
  }

  return (
    <CommentList
      comments={comments}
      postId={postId}
      searchQuery={searchQuery}
      onAddComment={handleAddComment}
      onEditComment={handleEditComment}
      onDeleteComment={handleDeleteComment}
      onLikeComment={handleLikeComment}
    />
  );
};

export default CommentManager;
