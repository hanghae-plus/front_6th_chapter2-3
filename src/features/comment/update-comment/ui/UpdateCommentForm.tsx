import { IComment } from '../../../../entities/comment/model/type';
import { Button, Textarea } from '../../../../shared/ui/components';
import { useUpdateComment } from '../model/useUpdateComment';

const UpdateCommentform = (comment: IComment) => {
  const { editComment, setBody, updateComment } = useUpdateComment(comment);
  
  return (
    <div className="space-y-4">
      <Textarea
        placeholder="댓글 내용"
        value={editComment.body || ''}
        onChange={(e) => setBody(e.target.value)}
      />
      <Button onClick={updateComment}>댓글 업데이트</Button>
    </div>
  );
};

export default UpdateCommentform;
