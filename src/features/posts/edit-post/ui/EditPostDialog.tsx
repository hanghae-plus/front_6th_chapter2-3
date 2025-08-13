import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Textarea,
} from '../../../../shared/ui';

interface EditPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPost: any;
  onPostChange: (post: any) => void;
  onSubmit: () => void;
}

export const EditPostDialog = ({
  open,
  onOpenChange,
  selectedPost,
  onPostChange,
  onSubmit,
}: EditPostDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <Input
            placeholder='제목'
            value={selectedPost?.title || ''}
            onChange={(e) => onPostChange({ ...selectedPost, title: e.target.value })}
          />
          <Textarea
            rows={15}
            placeholder='내용'
            value={selectedPost?.body || ''}
            onChange={(e) => onPostChange({ ...selectedPost, body: e.target.value })}
          />
          <Button onClick={onSubmit}>게시물 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPostDialog;
