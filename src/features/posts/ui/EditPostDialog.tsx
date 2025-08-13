import { useEffect, useState } from 'react';
import { useEditPostDialog } from '../model';
import { useUpdatePost } from '@/entities/posts';
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
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const { opened, data: editPostData, close } = useEditPostDialog();
  const { mutate: updatePost } = useUpdatePost();

  useEffect(() => {
    setTitle(editPostData?.title || '');
  }, [editPostData?.title]);

  useEffect(() => {
    setBody(editPostData?.body || '');
  }, [editPostData?.body]);

  if (!editPostData) {
    return null;
  }

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
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            rows={15}
            placeholder="내용"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <Button
            onClick={() => {
              updatePost({
                post: { ...editPostData, title, body },
                postId: editPostData.id,
              });
              close();
            }}
          >
            게시물 업데이트
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
