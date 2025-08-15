import * as DialogPrimitive from '@radix-ui/react-dialog';
import React from 'react';

import {
  useCommentActions,
  useDialogState,
  useSelectionState,
} from '../../entities/post/model/hooks';
import { DialogContent, DialogHeader, DialogTitle } from '../../shared/ui';
import { AddCommentFormContent } from '../PostDialogs';

const Dialog = DialogPrimitive.Root;

const CommentAddDialog: React.FC = () => {
  const { showAddCommentDialog, setShowAddCommentDialog } = useDialogState();

  const { newComment, setNewComment } = useSelectionState();

  const { addComment } = useCommentActions();

  return (
    <Dialog open={showAddCommentDialog} onOpenChange={setShowAddCommentDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <AddCommentFormContent
          newComment={newComment}
          setNewComment={setNewComment}
          onSubmit={addComment}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CommentAddDialog;
