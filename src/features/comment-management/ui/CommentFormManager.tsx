import React from 'react';

import { CommentForm } from '../../../entities/comment';
import { useCommentCrud, useCommentDialogs } from '../model';

interface CommentFormManagerProps {
  mode: 'add' | 'edit';
}

const CommentFormManager: React.FC<CommentFormManagerProps> = ({ mode }) => {
  const { addComment, updateComment } = useCommentCrud();
  const {
    showAddCommentDialog,
    showEditCommentDialog,
    selectedComment,
    newComment,
    closeAddDialog,
    closeEditDialog,
    setNewComment,
  } = useCommentDialogs();

  const isOpen = mode === 'add' ? showAddCommentDialog : showEditCommentDialog;
  const title = mode === 'add' ? '새 댓글 추가' : '댓글 수정';
  const submitText = mode === 'add' ? '댓글 추가' : '댓글 업데이트';

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      if (mode === 'add') {
        closeAddDialog();
      } else {
        closeEditDialog();
      }
    }
  };

  const handleValueChange = (value: string) => {
    if (mode === 'add') {
      setNewComment({ ...newComment, body: value });
    }
    // Edit mode의 경우 selectedComment 업데이트는 추후 구현
  };

  const handleSubmit = async () => {
    if (mode === 'add') {
      await addComment(newComment);
    } else if (mode === 'edit' && selectedComment) {
      await updateComment(selectedComment.id, { body: selectedComment.body });
    }
  };

  const currentValue = mode === 'add' ? newComment.body : selectedComment?.body || '';

  return (
    <CommentForm
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      title={title}
      submitText={submitText}
      currentValue={currentValue}
      onValueChange={handleValueChange}
      onSubmit={handleSubmit}
    />
  );
};

export default CommentFormManager;