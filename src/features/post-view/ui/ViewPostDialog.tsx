import { useViewPost } from '../model/useViewPost';

import { Dialog, DialogContent, DialogHeader, DialogTitle, HighlightText } from '@/shared/ui';

export const ViewPostDialog = ({ searchQuery, children }) => {
  const { isDialogOpen, postToView, closeDialog } = useViewPost();

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
