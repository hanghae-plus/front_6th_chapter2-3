import {
  Button,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Textarea,
} from '../../../../shared/ui/components';
import { useDialogStore } from '../../../../shared/hook/useDialogStore';
import { IComment } from '../../../../entities/comment/model/type';
import { useUpdateComment } from '../model/useUpdateComment';

interface UpdateCommentForm {
  comment: IComment;
}

const UpdateCommentForm = ({ comment }: UpdateCommentForm) => {
  const { setCommentModal } = useDialogStore();
  const { editComment, setBody, updateComment } = useUpdateComment(
    comment,
    () => {
      setCommentModal({ show: false, content: null });
    }
  );

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

export default UpdateCommentForm;
