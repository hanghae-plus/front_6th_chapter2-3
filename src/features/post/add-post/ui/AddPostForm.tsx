import { useDialogStore } from '../../../../shared/hook/useDialogStore';
import {
  Button,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Textarea,
} from '../../../../shared/ui/components';
import { useAddPost } from '../model/useAddPost';

const AddPostForm = () => {
  const setPostModal = useDialogStore((state) => state.setPostModal);
  const { newPost, setTitle, setBody, setUserId, addPost } = useAddPost(() => {
    setPostModal({ show: false, content: null });
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>새 게시물 추가</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <Input
          placeholder="제목"
          value={newPost.title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          rows={30}
          placeholder="내용"
          value={newPost.body}
          onChange={(e) => setBody(e.target.value)}
        />
        <Input
          type="number"
          placeholder="사용자 ID"
          value={newPost.userId}
          onChange={(e) => setUserId(Number(e.target.value))}
        />
        <Button onClick={addPost}>게시물 추가</Button>
      </div>
    </DialogContent>
  );
};

export default AddPostForm;
