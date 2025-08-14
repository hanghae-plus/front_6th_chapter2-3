import { ChangeEvent } from 'react';

import { useEditPost } from '../model/useEditPost';

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Textarea,
} from '@/shared/ui';

export const EditPostDialog = () => {
  const { isDialogOpen, postToEdit, setPostToEdit, closeDialog, handleSubmit } = useEditPost();

  if (!postToEdit) return null;

  const handleFormChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setPostToEdit({ ...postToEdit, [e.target.name]: e.target.value });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <Input
            name='title'
            placeholder='제목'
            value={postToEdit.title}
            onChange={(e) => handleFormChange(e)}
          />
          <Textarea
            name='body'
            rows={15}
            placeholder='내용'
            value={postToEdit.body}
            onChange={(e) => handleFormChange(e)}
          />
          <Button onClick={handleSubmit}>게시물 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
