import { Dialog, DialogContent, DialogHeader, DialogTitle, HighlightText } from '@/shared/ui';

export const ViewPostDialog = ({
  showPostDetailDialog,
  setShowPostDetailDialog,
  selectedPost,
  searchQuery,
  children,
}) => {
  return (
    <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <DialogTitle>
            <HighlightText text={selectedPost?.title} highlight={searchQuery} />
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <p>
            <HighlightText text={selectedPost?.body} highlight={searchQuery} />
          </p>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};
