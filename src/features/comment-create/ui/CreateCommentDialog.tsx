import { useCommentDialogStore } from '@/entities/comment/model/commentDialogStore';
import { useAddComment } from '@/entities/comment/model/useComments';
import { useViewPostStore } from '@/features/post-view/model/viewPostStore';
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from '@/shared/ui';

export const CreateCommentDialog = () => {
  const { postToView } = useViewPostStore();
  const { isAddDialogOpen, newCommentBody, setNewCommentBody, closeDialogs } =
    useCommentDialogStore();

  const { mutate: addComment } = useAddComment();

  if (!postToView) return null;

  const handleSubmit = () => {
    addComment(
      { postId: postToView.id, userId: postToView.userId, body: newCommentBody },
      {
        onSuccess: () => {
          closeDialogs();
        },
      },
    );
  };

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={closeDialogs}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <Textarea
            placeholder='댓글 내용'
            value={newCommentBody}
            onChange={(e) => setNewCommentBody(e.target.value)}
          />
          <Button onClick={handleSubmit}>댓글 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
