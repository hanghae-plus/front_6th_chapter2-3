import {
  Button,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Textarea,
} from '../../../../shared/ui/components';
import { useAddComment } from '../model/useAddComment';

const AddCommentForm = () => {
  const { newComment, setBody, addComment } = useAddComment();

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
