import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Textarea,
} from '../../../../shared/ui';

interface AddCommentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newComment: {
    body: string;
    postId: number | null;
    userId: number;
  };
  onCommentChange: (comment: { body: string; postId: number | null; userId: number }) => void;
  onSubmit: () => void;
}

export const AddCommentDialog = ({
  open,
  onOpenChange,
  newComment,
  onCommentChange,
  onSubmit,
}: AddCommentDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <Textarea
            placeholder='댓글 내용'
            value={newComment.body}
            onChange={(e) => onCommentChange({ ...newComment, body: e.target.value })}
          />
          <Button onClick={onSubmit}>댓글 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCommentDialog;
