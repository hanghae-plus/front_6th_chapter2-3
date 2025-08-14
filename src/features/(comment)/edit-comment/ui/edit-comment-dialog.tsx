import { useEffect, useState } from 'react';
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from '@/shared/ui';
import { commentApi, type Comment } from '@/entities/comment';

type EditCommentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  comment: Comment | null;
  onSuccess?: () => void;
};

export function EditCommentDialog({
  open,
  onOpenChange,
  comment,
  onSuccess,
}: EditCommentDialogProps) {
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setBody(comment?.body ?? '');
  }, [comment]);

  const handleSubmit = async () => {
    if (!comment) return;
    try {
      setSubmitting(true);
      await commentApi.updateComment(comment.id, { body });
      onSuccess?.();
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <Textarea
            placeholder='댓글 내용'
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <Button disabled={submitting || !comment} onClick={handleSubmit}>
            댓글 업데이트
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
