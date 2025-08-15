import * as DialogPrimitive from '@radix-ui/react-dialog';
import React from 'react';

import { useDialogState, usePostActions, useSelectionState } from '../../entities/post/model/hooks';
import { DialogContent, DialogHeader, DialogTitle } from '../../shared/ui';
import { EditPostFormContent } from '../PostDialogs';

const Dialog = DialogPrimitive.Root;

const PostEditDialog: React.FC = () => {
  const { showEditDialog, setShowEditDialog } = useDialogState();

  const { selectedPost, setSelectedPost } = useSelectionState();

  const { updatePost } = usePostActions();

  return (
    <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <EditPostFormContent
          selectedPost={selectedPost}
          setSelectedPost={setSelectedPost}
          onSubmit={updatePost}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PostEditDialog;
