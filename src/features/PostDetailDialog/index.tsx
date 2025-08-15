import * as DialogPrimitive from '@radix-ui/react-dialog';
import React, { useEffect } from 'react';

import {
  useCommentActions,
  useDialogState,
  usePostsState,
  useSelectionState,
} from '../../entities/post/model/hooks';
import { highlightText } from '../../shared/lib/highlightText';
import { DialogContent, DialogHeader, DialogTitle } from '../../shared/ui';
import CommentsList from '../CommentsList';

const Dialog = DialogPrimitive.Root;

const PostDetailDialog: React.FC = () => {
  const { showPostDetailDialog, setShowPostDetailDialog } = useDialogState();

  const { selectedPost } = useSelectionState();

  const { searchQuery } = usePostsState();

  const { fetchComments } = useCommentActions();

  useEffect(() => {
    if (showPostDetailDialog && selectedPost) {
      fetchComments(selectedPost.id);
    }
  }, [showPostDetailDialog, selectedPost]);

  return (
    <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <DialogTitle>{highlightText(selectedPost?.title ?? '', searchQuery)}</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <p>{highlightText(selectedPost?.body ?? '', searchQuery)}</p>
          {selectedPost && <CommentsList postId={selectedPost.id} searchQuery={searchQuery} />}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostDetailDialog;
