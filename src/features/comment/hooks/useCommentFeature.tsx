import { useState } from 'react';
import { Comment, NewComment } from '../../../entities/comment';
import {
  fetchComments,
  addComment,
  updateComment,
  deleteComment,
  likeComment,
} from '../../../entities/comment';

export const useCommentFeature = () => {
  // Comment 관련 상태 (PostsManagerPage.tsx에서 그대로 복사)
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [newComment, setNewComment] = useState<NewComment>({ body: '', postId: null, userId: 1 });
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false);
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false);

  // API 호출 핸들러들
  const handleFetchComments = async (postId: number) => {
    await fetchComments(postId, comments, setComments);
  };

  const handleAddComment = async () => {
    await addComment(setComments, comments, setShowAddCommentDialog, setNewComment, newComment);
  };

  const handleUpdateComment = async () => {
    if (selectedComment) {
      await updateComment(setComments, comments, setShowEditCommentDialog, selectedComment);
    }
  };

  const handleDeleteComment = async (id: number, postId: number) => {
    await deleteComment(setComments, comments, id, postId);
  };

  const handleLikeComment = async (id: number, postId: number) => {
    await likeComment(setComments, comments, id, postId);
  };

  return {
    // 상태
    comments,
    selectedComment,
    newComment,
    showAddCommentDialog,
    showEditCommentDialog,
    // 상태 설정자
    setComments,
    setSelectedComment,
    setNewComment,
    setShowAddCommentDialog,
    setShowEditCommentDialog,
    // 함수들
    handleFetchComments,
    handleAddComment,
    handleUpdateComment,
    handleDeleteComment,
    handleLikeComment,
  };
};
