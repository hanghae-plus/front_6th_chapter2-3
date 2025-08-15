import { useState } from 'react';
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from '@/shared/ui';
import { commentApi } from '@/entities/comment';

type AddCommentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: number | null;
  userId?: number;
  onSuccess?: () => void;
};

export function AddCommentDialog({
  open,
  onOpenChange,
  postId,
  userId = 1,
  onSuccess,
}: AddCommentDialogProps) {
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!postId) return;
    try {
      setSubmitting(true);
      await commentApi.addComment({ body, postId, userId });
      onSuccess?.();
      onOpenChange(false);
      setBody('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <Textarea
            placeholder='댓글 내용'
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <Button disabled={submitting || !postId} onClick={handleSubmit}>
            댓글 추가
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
