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
import { useEditComment } from '../model/hooks';

export const EditCommentDialog = () => {
  const { isDialogOpen, closeDialog } = useDialogStore();
  const { selectedComment, setSelectedComment, updateComment } = useEditComment();
  return (
    <Dialog
      open={isDialogOpen(DIALOG_KEYS.EDIT_COMMENT)}
      onOpenChange={() => closeDialog(DIALOG_KEYS.EDIT_COMMENT)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <Textarea
            placeholder='댓글 내용'
            value={selectedComment?.body || ''}
            onChange={(e) =>
              selectedComment && setSelectedComment({ ...selectedComment, body: e.target.value })
            }
          />
          <Button onClick={updateComment}>댓글 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditCommentDialog;
