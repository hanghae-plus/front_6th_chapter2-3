import { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Textarea,
} from '@/shared/ui';
import type { Post } from '@/entities/post';
import { useEditPost } from '../model';

type EditPostDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: Post | null;
  onSuccess?: () => void;
};

export function EditPostDialog({ open, onOpenChange, post, onSuccess }: EditPostDialogProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const editPostMutation = useEditPost();

  useEffect(() => {
    setTitle(post?.title ?? '');
    setBody(post?.body ?? '');
  }, [post]);

  const handleSubmit = async () => {
    if (!post) return;
    try {
      await editPostMutation.mutateAsync({ id: post.id, payload: { title, body } });
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error('포스트 수정 오류:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <Input placeholder='제목' value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea
            rows={15}
            placeholder='내용'
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <Button disabled={editPostMutation.isPending} onClick={handleSubmit}>
            게시물 업데이트
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
