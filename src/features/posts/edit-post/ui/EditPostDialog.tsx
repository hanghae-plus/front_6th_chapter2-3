import { DIALOG_KEYS } from '../../../../shared/constant/dialog';
import { useDialogStore } from '../../../../shared/store/dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Textarea,
} from '../../../../shared/ui';
import { EditPostDialogProps } from '../model/type';

export const EditPostDialog = ({ selectedPost, onPostChange, onSubmit }: EditPostDialogProps) => {
  const { isDialogOpen, closeDialog } = useDialogStore();

  return (
    <Dialog
      open={isDialogOpen(DIALOG_KEYS.EDIT_POST)}
      onOpenChange={() => closeDialog(DIALOG_KEYS.EDIT_POST)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <Input
            placeholder='제목'
            value={selectedPost?.title || ''}
            onChange={(e) => onPostChange({ ...selectedPost, title: e.target.value })}
          />
          <Textarea
            rows={15}
            placeholder='내용'
            value={selectedPost?.body || ''}
            onChange={(e) => onPostChange({ ...selectedPost, body: e.target.value })}
          />
          <Button onClick={onSubmit}>게시물 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPostDialog;
