import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Textarea,
} from '../../../../shared/ui';

interface EditCommentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedComment: any;
  onCommentChange: (comment: any) => void;
  onSubmit: () => void;
}

export const EditCommentDialog = ({
  open,
  onOpenChange,
  selectedComment,
  onCommentChange,
  onSubmit,
}: EditCommentDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <Textarea
            placeholder='댓글 내용'
            value={selectedComment?.body || ''}
            onChange={(e) => onCommentChange({ ...selectedComment, body: e.target.value })}
          />
          <Button onClick={onSubmit}>댓글 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditCommentDialog;
