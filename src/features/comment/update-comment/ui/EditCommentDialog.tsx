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
import { EditCommentDialogProps } from '../model/type';

export const EditCommentDialog = ({
  selectedComment,
  onCommentChange,
  onSubmit,
}: EditCommentDialogProps) => {
  const { isDialogOpen, closeDialog } = useDialogStore();
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
            onChange={(e) => onCommentChange({ ...selectedComment, body: e.target.value })}
          />
          <Button onClick={onSubmit}>댓글 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditCommentDialog;
