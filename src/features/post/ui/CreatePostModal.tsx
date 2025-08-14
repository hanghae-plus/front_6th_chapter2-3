import { useState } from 'react';

import { useCreatePost } from '../../../entities';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Textarea,
  Button,
  Input,
} from '../../../shared';

interface CreatePostModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreatePostModal = ({ isOpen, onOpenChange }: CreatePostModalProps) => {
  const [newPost, setNewPost] = useState({ title: '', body: '', userId: 1 });
  const { mutate: createPost } = useCreatePost();

  const handleAddPost = () => {
    createPost(newPost);
    onOpenChange(false);
    setNewPost({ title: '', body: '', userId: 1 });
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 게시물 추가</DialogTitle>
          <DialogDescription>새로운 게시물을 작성해보세요.</DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <Input
            placeholder='제목'
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <Textarea
            rows={30}
            placeholder='내용'
            value={newPost.body}
            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
          />
          <Input
            type='number'
            placeholder='사용자 ID'
            value={newPost.userId}
            onChange={(e) => setNewPost({ ...newPost, userId: Number(e.target.value) })}
          />
          <Button onClick={handleAddPost}>게시물 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
