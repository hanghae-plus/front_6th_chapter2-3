import {
  Button,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Textarea,
} from '../../../../shared/ui/components';
import { IComment } from '../../../../entities/comment/model/type';
import { useUpdateComment } from '../model/useUpdateComment';

const UpdateCommentform = (comment: IComment) => {
  const { editComment, setBody, updateComment } = useUpdateComment(comment);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>댓글 수정</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <Textarea
          placeholder="댓글 내용"
          value={editComment.body || ''}
          onChange={(e) => setBody(e.target.value)}
        />
        <Button onClick={updateComment}>댓글 업데이트</Button>
      </div>
    </DialogContent>
  );
};

export default UpdateCommentform;
