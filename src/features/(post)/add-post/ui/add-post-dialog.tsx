import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Textarea,
} from '@/shared/ui';
import { postApi } from '@/entities/post';

type AddPostDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export function AddPostDialog({ open, onOpenChange, onSuccess }: AddPostDialogProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [userId, setUserId] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await postApi.addPost({ title, body, userId });
      onSuccess?.();
      onOpenChange(false);
      setTitle('');
      setBody('');
      setUserId(1);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 게시물 추가</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <Input placeholder='제목' value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea
            rows={30}
            placeholder='내용'
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <Input
            type='number'
            placeholder='사용자 ID'
            value={userId}
            onChange={(e) => setUserId(Number(e.target.value))}
          />
          <Button disabled={submitting} onClick={handleSubmit}>
            게시물 추가
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
