import { DIALOG_KEYS } from '../../../../shared/constant/dialog';
import { useDialogStore } from '../../../../shared/store/dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Textarea,
} from '../../../../shared/ui';
import { useAddComment } from '../model/hooks';

export const AddCommentDialog = () => {
  const { isDialogOpen, closeDialog } = useDialogStore();
  const { newComment, setNewComment, addComment } = useAddComment();
  return (
    <Dialog
      open={isDialogOpen(DIALOG_KEYS.ADD_COMMENT)}
      onOpenChange={() => closeDialog(DIALOG_KEYS.ADD_COMMENT)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <Textarea
            placeholder='댓글 내용'
            value={newComment.body}
            onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
          />
          <Button onClick={addComment}>댓글 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCommentDialog;
