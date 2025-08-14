import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "../../../shared/ui";
import { Post } from "../../../entities/post/types";
import { Dispatch, SetStateAction } from "react";
import { showEditPostDialogAtom } from "../models/dialog.atoms";
import { useAtom } from "jotai";

export const PostUpdateDialog = ({
  selectedPost,
  setSelectedPost,
  handleUpdatePost,
}: {
  selectedPost: Post | null;
  setSelectedPost: Dispatch<SetStateAction<Post | null>>;
  handleUpdatePost: () => void;
}) => {
  const [showEditDialog, setShowEditDialog] = useAtom(showEditPostDialogAtom);
  return (
    <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={selectedPost?.title || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              selectedPost && setSelectedPost({ ...selectedPost, title: e.target.value })
            }
          />
          <Textarea
            rows={15}
            placeholder="내용"
            value={selectedPost?.body || ""}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              selectedPost && setSelectedPost({ ...selectedPost, body: e.target.value })
            }
          />
          <Button onClick={handleUpdatePost}>게시물 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
