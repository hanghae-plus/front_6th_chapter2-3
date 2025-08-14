import { useDialogStore, useSelectedPostStore } from '../model/store';
import { usePosts } from '../model';
import { Button } from '@/shared/ui/button';
import { Dialog } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { TextArea } from '@/shared/ui/textarea';

const PostEditDialog = () => {
  const { showEditDialog, setShowEditDialog } = useDialogStore();
  const { selectedPost, setSelectedPost } = useSelectedPostStore();
  const { updatePost } = usePosts();

  const handleEditPost = async () => {
    if (selectedPost) {
      updatePost.mutate(
        {
          data: selectedPost, // ✅ 이제 Post 타입
        },
        {
          onSuccess: () => {
            setShowEditDialog(false);
          },
        },
      );
    }
  };
  return (
    <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>게시물 수정</Dialog.Title>
        </Dialog.Header>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={selectedPost?.title || ''}
            onChange={(e) =>
              setSelectedPost(
                selectedPost
                  ? { ...selectedPost, title: e.target.value }
                  : null,
              )
            }
          />
          <TextArea
            rows={15}
            placeholder="내용"
            value={selectedPost?.body || ''}
            onChange={(e) =>
              setSelectedPost(
                selectedPost ? { ...selectedPost, body: e.target.value } : null,
              )
            }
          />
          <Button onClick={handleEditPost}>게시물 업데이트</Button>
        </div>
      </Dialog.Content>
    </Dialog>
  );
};

export default PostEditDialog;
