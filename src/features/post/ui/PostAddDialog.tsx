import { Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea, Button } from "../../../shared/ui";
import { Post } from "../../../entities/post/models/types";
import { showAddPostDialogAtom } from "../models/dialog.atoms";
import { useAtom } from "jotai";

export const PostAddDialog = ({
  newPost,
  setNewPost,
  handleAddPost,
}: {
  newPost: Partial<Post>;
  setNewPost: (post: Partial<Post>) => void;
  handleAddPost: () => void;
}) => {
  const [showAddDialog, setShowAddDialog] = useAtom(showAddPostDialogAtom);
  return (
    <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 게시물 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={newPost.title || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <Textarea
            rows={30}
            placeholder="내용"
            value={newPost.body || ""}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewPost({ ...newPost, body: e.target.value })}
          />
          <Input
            type="number"
            placeholder="사용자 ID"
            value={newPost.userId || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewPost({ ...newPost, userId: Number(e.target.value) })
            }
          />
          <Button onClick={handleAddPost}>게시물 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
