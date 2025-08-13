import {
  Button,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Textarea,
} from '../../../../shared/ui/components';
import { useDialogStore } from '../../../../shared/hook/useDialogStore';
import { useAddComment } from '../model/useAddComment';

interface AddCommentFormProps {
  postId: number;
}

const AddCommentForm = ({ postId }: AddCommentFormProps) => {
  const { setCommentModal } = useDialogStore();
  const { newComment, setBody, addComment } = useAddComment(postId, () => {
    setCommentModal({ show: false, content: null });
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>새 댓글 추가</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <Textarea
          placeholder="댓글 내용"
          value={newComment.body}
          onChange={(e) => setBody(e.target.value)}
        />
        <Button onClick={addComment}>댓글 추가</Button>
      </div>
    </DialogContent>
  );
};

export default AddCommentForm;
