import { useCommentDialogStore } from '@/entities/comment/model/commentDialogStore';
import { useUpdateComment } from '@/entities/comment/model/useComments';
import { useViewPostStore } from '@/features';
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from '@/shared/ui';

export const EditCommentDialog = () => {
  const { postToView } = useViewPostStore();
  const { isEditDialogOpen, closeDialogs, commentToEdit, setCommentToEdit } =
    useCommentDialogStore();

  const { mutate: updateComment } = useUpdateComment();

  if (!postToView || !commentToEdit) return null;

  const handleSubmit = () => {
    updateComment(
      { commentId: commentToEdit.id, body: commentToEdit.body },
      {
        onSuccess: () => {
          closeDialogs();
        },
      },
    );
  };

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={closeDialogs}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <Textarea
            placeholder='댓글 내용'
            value={commentToEdit.body}
            onChange={(e) => setCommentToEdit({ ...commentToEdit, body: e.target.value })}
          />
          <Button onClick={handleSubmit}>댓글 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
