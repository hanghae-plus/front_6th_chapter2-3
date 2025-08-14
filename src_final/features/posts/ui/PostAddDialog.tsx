import { useDialogStore, useNewPostStore } from '../model/store';
import { usePosts } from '../model';

import { Button } from '@/shared/ui/button';
import { Dialog } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { TextArea } from '@/shared/ui/textarea';

const PostAddDialog = () => {
  const { showAddDialog, setShowAddDialog } = useDialogStore();
  const { newPost, setNewPost } = useNewPostStore();

  const { createPost } = usePosts();
  const handelAddPost = async () => {
    return createPost.mutate(newPost, {
      onSuccess: async () => {
        setShowAddDialog(false);
        setNewPost({ title: '', body: '', userId: 1 });
      },
    });
  };
  return (
    <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>새 게시물 추가</Dialog.Title>
        </Dialog.Header>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <TextArea
            rows={30}
            placeholder="내용"
            value={newPost.body}
            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
            ref={null}
          />
          <Input
            type="number"
            placeholder="사용자 ID"
            value={newPost.userId}
            onChange={(e) =>
              setNewPost({ ...newPost, userId: Number(e.target.value) })
            }
          />
          <Button onClick={handelAddPost}>게시물 추가</Button>
        </div>
      </Dialog.Content>
    </Dialog>
  );
};

export default PostAddDialog;
