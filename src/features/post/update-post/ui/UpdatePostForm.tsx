import { IPost } from '../../../../entities/post/model/type';
import { Button, Input, Textarea } from '../../../../shared/ui/components';
import { useUpdatePost } from '../model/useUpdatePost';

const UpdatePostForm = (post: IPost) => {
  const { editPost, setTitle, setBody, updatePost } = useUpdatePost(post);

  return (
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
  );
};

export default UpdatePostForm;
