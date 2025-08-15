import { useCreatePost } from '../model/useCreatePost';

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Textarea,
} from '@/shared/ui';

export const CreatePostDialog = () => {
  const { isDialogOpen, newPost, closeDialog, setNewPost, handleSubmit } = useCreatePost();

  return (
    <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 게시물 추가</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <Input
            placeholder='제목'
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <Textarea
            rows={10}
            placeholder='내용'
            value={newPost.body}
            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
          />
          <Button onClick={handleSubmit}>게시물 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
