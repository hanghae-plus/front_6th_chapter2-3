import { useCommentState } from './useCommentState';

export const useCommentDialogs = () => {
  const {
    showAddCommentDialog,
    showEditCommentDialog,
    selectedComment,
    newComment,
    setShowAddCommentDialog,
    setShowEditCommentDialog,
    setSelectedComment,
    setNewComment,
    resetNewComment,
  } = useCommentState();

  const openAddDialog = (postId: number) => {
    setNewComment({ body: '', postId, userId: 1 });
    setShowAddCommentDialog(true);
  };

  const closeAddDialog = () => {
    setShowAddCommentDialog(false);
    resetNewComment();
  };

  const openEditDialog = (comment: any) => {
    setSelectedComment(comment);
    setShowEditCommentDialog(true);
  };

  const closeEditDialog = () => {
    setShowEditCommentDialog(false);
    setSelectedComment(null);
  };

  return {
    showAddCommentDialog,
    showEditCommentDialog,
    selectedComment,
    newComment,
    openAddDialog,
    closeAddDialog,
    openEditDialog,
    closeEditDialog,
    setNewComment,
  };
};