import { Button } from '@/shared/ui/button';
import { Dialog } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { useCommentStore } from '../model/store';
import { useComments } from '../model/hooks.ts';

const AddComment = () => {
  const { showAddCommentDialog, setShowAddCommentDialog } = useCommentStore();
  const { newComment, setNewComment } = useCommentStore();
  const { createComments } = useComments();
  const handelAddComment = () => {
    createComments.mutate(newComment);
  };
  return (
    <Dialog open={showAddCommentDialog} onOpenChange={setShowAddCommentDialog}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>새 댓글 추가</Dialog.Title>
        </Dialog.Header>
        <div className="space-y-4">
          <Input
            placeholder="댓글 내용"
            value={newComment.body}
            onChange={(e) =>
              setNewComment({ ...newComment, body: e.target.value })
            }
          />
          <Button onClick={handelAddComment}>댓글 추가</Button>
        </div>
      </Dialog.Content>
    </Dialog>
  );
};

export default AddComment;
