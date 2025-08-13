import { useState } from 'react';
import { useAddPostDialog } from '../model';
import { useAddPost } from '@/entities/posts';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Textarea,
} from '@/shared/ui';

export const AddPostDialog = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [userId, setUserId] = useState(1);
  const { opened, close } = useAddPostDialog();
  const { mutate: addPost } = useAddPost();

  return (
    <Dialog
      open={opened}
      onOpenChange={(opened) => {
        if (!opened) {
          close();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 게시물 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            rows={30}
            placeholder="내용"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <Input
            type="number"
            placeholder="사용자 ID"
            value={userId}
            onChange={(e) => setUserId(Number(e.target.value))}
          />
          <Button
            onClick={() => {
              addPost({
                title,
                body,
                userId,
              });
              close();
            }}
          >
            게시물 추가
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
