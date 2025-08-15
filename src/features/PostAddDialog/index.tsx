import * as DialogPrimitive from '@radix-ui/react-dialog';
import React from 'react';

import { useDialogState, usePostActions, useSelectionState } from '../../entities/post/model/hooks';
import { DialogContent, DialogHeader, DialogTitle } from '../../shared/ui';
import { AddPostFormContent } from '../PostDialogs';

const Dialog = DialogPrimitive.Root;

const PostAddDialog: React.FC = () => {
  const { showAddDialog, setShowAddDialog } = useDialogState();

  const { newPost, setNewPost } = useSelectionState();

  const { addPost } = usePostActions();

  return (
    <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 게시물 추가</DialogTitle>
        </DialogHeader>
        <AddPostFormContent newPost={newPost} setNewPost={setNewPost} onSubmit={addPost} />
      </DialogContent>
    </Dialog>
  );
};

export default PostAddDialog;
