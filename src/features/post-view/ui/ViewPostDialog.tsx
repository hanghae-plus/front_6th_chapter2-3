import { useViewPost } from '../model/useViewPost';

import { usePostSearch } from '@/features/post-search/model/usePostSearch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, HighlightText } from '@/shared/ui';

interface ViewPostDialogProps {
  children: React.ReactNode;
}

export const ViewPostDialog = ({ children }: ViewPostDialogProps) => {
  const { isDialogOpen, postToView, closeDialog } = useViewPost();
  const { searchQuery } = usePostSearch();

  if (!postToView) return null;

  return (
    <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <DialogTitle>
            <HighlightText text={postToView.title} highlight={searchQuery} />
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <p>
            <HighlightText text={postToView.body} highlight={searchQuery} />
          </p>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};
