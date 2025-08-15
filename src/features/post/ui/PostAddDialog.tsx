import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui";
import { Input } from "@/shared/ui";
import { Textarea } from "@/shared/ui";
import { Button } from "@/shared/ui";
import { usePostDialogs } from "../api/usePostDialogs";

interface PostAddDialogProps {
  open: boolean;
  onClose: () => void;
}

export const PostAddDialog = ({ open, onClose }: PostAddDialogProps) => {
  const { newPost, setNewPost, handleAddPost } = usePostDialogs();

  const addPost = async () => {
    await handleAddPost();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 게시물 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <Textarea
            rows={30}
            placeholder="내용"
            value={newPost.body}
            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
          />
          <Input
            type="number"
            placeholder="사용자 ID"
            value={newPost.userId}
            onChange={(e) =>
              setNewPost({ ...newPost, userId: Number(e.target.value) })
            }
          />
          <Button onClick={addPost}>게시물 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
