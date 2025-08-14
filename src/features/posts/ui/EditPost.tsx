import { useEditPostDialog } from '../model';
import { Edit2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useEditPost } from '../model';
import type { Post } from '@/entities/posts';
import { Button } from '@/shared/ui';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Textarea,
} from '@/shared/ui';

interface EditPostButtonProps {
  post: Post;
}

// 게시물 수정 버튼
export const EditPostButton = ({ post }: EditPostButtonProps) => {
  const { open: openEditDialog } = useEditPostDialog();

  return (
    <Button variant="ghost" size="sm" onClick={() => openEditDialog(post)}>
      <Edit2 className="w-4 h-4" />
    </Button>
  );
};

// 게시물 수정 다이얼로그
export const EditPostDialog = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const { opened, data: editPostData, close } = useEditPostDialog();
  const { mutate: editPost } = useEditPost();

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
              editPost({
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
