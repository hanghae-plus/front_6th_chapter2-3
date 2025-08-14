import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from '../../../shared/ui';

interface CommentFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  comment: { body: string };
  onCommentChange: (comment: { body: string }) => void;
  onSubmit: () => void;
  submitText: string;
}

export const CommentForm = ({
  isOpen,
  onOpenChange,
  title,
  comment,
  onCommentChange,
  onSubmit,
  submitText,
}: CommentFormProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <Textarea
            placeholder='댓글 내용'
            value={comment.body}
            onChange={(e) => onCommentChange({ ...comment, body: e.target.value })}
          />
          <Button onClick={onSubmit}>{submitText}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
