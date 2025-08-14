import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../shared/ui';
import { Post } from '../../../entities/post';
import { highlightText } from '../../../shared/utils';
import { ReactNode } from 'react';

interface PostDetailProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  post: Post | null;
  searchQuery: string;
  children?: ReactNode;
}

export const PostDetail = ({ isOpen, onOpenChange, post, searchQuery, children }: PostDetailProps) => {
  if (!post) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <DialogTitle>
            {post.title && post.title.trim()
              ? highlightText(post.title, searchQuery)
              : '게시물 상세 보기'}
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <p>{highlightText(post.body || '', searchQuery)}</p>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};
