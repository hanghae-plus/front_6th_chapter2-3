import React, { useEffect, useState } from 'react';

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Textarea,
} from '../../../shared/ui';
import { useCommentDialogs, useCommentManagement } from '../model';

interface CommentFormProps {
  mode: 'add' | 'edit';
}

const CommentForm: React.FC<CommentFormProps> = ({ mode }) => {
  const { addComment, updateComment } = useCommentManagement();
  const {
    showAddDialog,
    showEditDialog,
    selectedComment,
    postId,
    closeAddDialog,
    closeEditDialog,
  } = useCommentDialogs();

  const [commentBody, setCommentBody] = useState('');

  const isOpen = mode === 'add' ? showAddDialog : showEditDialog;
  const title = mode === 'add' ? '새 댓글 추가' : '댓글 수정';
  const submitText = mode === 'add' ? '댓글 추가' : '댓글 업데이트';

  useEffect(() => {
    if (mode === 'edit' && selectedComment) {
      setCommentBody(selectedComment.body);
    } else if (mode === 'add') {
      setCommentBody('');
    }
  }, [mode, selectedComment, isOpen]);

  const handleSubmit = async () => {
    if (!commentBody.trim()) return;

    try {
      if (mode === 'add' && postId) {
        await addComment({
          body: commentBody,
          postId: postId,
          userId: 1,
        });
        closeAddDialog();
        setCommentBody('');
      } else if (mode === 'edit' && selectedComment) {
        await updateComment(selectedComment.id, { body: commentBody });
        closeEditDialog();
        setCommentBody('');
      }
    } catch (error) {
      console.error('댓글 처리 오류:', error);
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      if (mode === 'add') {
        closeAddDialog();
      } else {
        closeEditDialog();
      }
      setCommentBody('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <Textarea
            placeholder='댓글 내용을 입력하세요...'
            value={commentBody}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setCommentBody(e.target.value)
            }
            rows={4}
          />
          <div className='flex justify-end gap-2'>
            <Button variant='outline' onClick={() => handleClose(false)}>
              취소
            </Button>
            <Button onClick={handleSubmit} disabled={!commentBody.trim()}>
              {submitText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentForm;
