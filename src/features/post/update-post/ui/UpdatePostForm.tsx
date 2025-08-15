import {
  Button,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Textarea,
} from '../../../../shared/ui/components';
import { useDialogStore } from '../../../../shared/hook/useDialogStore';
import { IPost } from '../../../../entities/post/model/type';
import { useUpdatePost } from '../model/useUpdatePost';

interface UpdatePostFormProps {
  post: IPost;
}

const UpdatePostForm = ({ post }: UpdatePostFormProps) => {
  const setPostModal = useDialogStore((state) => state.setPostModal);
  const { editPost, setTitle, setBody, updatePost } = useUpdatePost(
    post,
    () => {
      setPostModal({ show: false, content: null });
    }
  );

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>게시물 수정</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <Input
          placeholder="제목"
          value={editPost.title || ''}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          rows={15}
          placeholder="내용"
          value={editPost.body || ''}
          onChange={(e) => setBody(e.target.value)}
        />
        <Button onClick={updatePost}>게시물 업데이트</Button>
      </div>
    </DialogContent>
  );
};

export default UpdatePostForm;
