import { DIALOG_KEYS } from '../../../../shared/constant/dialog';
import { useDialogStore } from '../../../../shared/store/dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../../shared/ui';
import { PostDetailDialogProps } from '../model/type';

export const PostDetailDialog = ({
  selectedPost,
  searchQuery,
  highlightText,
  renderComments,
}: PostDetailDialogProps) => {
  const { isDialogOpen, closeDialog } = useDialogStore();

  return (
    <Dialog
      open={isDialogOpen(DIALOG_KEYS.POST_DETAIL)}
      onOpenChange={() => closeDialog(DIALOG_KEYS.POST_DETAIL)}
    >
      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <DialogTitle>{highlightText(selectedPost?.title, searchQuery)}</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <p>{highlightText(selectedPost?.body, searchQuery)}</p>
          {renderComments(selectedPost?.id)}
        </div>
      </DialogContent>
    </Dialog>
  );
};
