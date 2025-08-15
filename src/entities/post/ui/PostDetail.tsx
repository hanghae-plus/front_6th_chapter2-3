import React from 'react';

import { highlightText } from '../../../shared/lib';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../shared/ui';
import { Post } from '../model';

interface PostDetailProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  post: Post | null;
  searchQuery?: string;
  children?: React.ReactNode;
}

const PostDetail: React.FC<PostDetailProps> = ({
  isOpen,
  onOpenChange,
  post,
  searchQuery = '',
  children,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <DialogTitle>
            {highlightText(post?.title || '', searchQuery)}
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <p>{highlightText(post?.body || '', searchQuery)}</p>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostDetail;
