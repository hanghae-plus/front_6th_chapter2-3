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
import { AddPostDialogProps } from '../model/type';

export const AddPostDialog = ({ newPost, onPostChange, onSubmit }: AddPostDialogProps) => {
  const { isDialogOpen, closeDialog } = useDialogStore();
  return (
    <Dialog
      open={isDialogOpen(DIALOG_KEYS.ADD_POST)}
      onOpenChange={() => closeDialog(DIALOG_KEYS.ADD_POST)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 게시물 추가</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <Input
            placeholder='제목'
            value={newPost.title}
            onChange={(e) => onPostChange({ ...newPost, title: e.target.value })}
          />
          <Textarea
            rows={30}
            placeholder='내용'
            value={newPost.body}
            onChange={(e) => onPostChange({ ...newPost, body: e.target.value })}
          />
          <Input
            type='number'
            placeholder='사용자 ID'
            value={newPost.userId}
            onChange={(e) => onPostChange({ ...newPost, userId: Number(e.target.value) })}
          />
          <Button onClick={onSubmit}>게시물 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddPostDialog;
