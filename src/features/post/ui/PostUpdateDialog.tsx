import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "../../../shared/ui";
import { Post } from "../../../entities/post/types";
import { Dispatch, SetStateAction } from "react";

export const PostUpdateDialog = ({
  showEditDialog,
  setShowEditDialog,
  selectedPost,
  setSelectedPost,
  handleUpdatePost,
}: {
  showEditDialog: boolean;
  setShowEditDialog: (show: boolean) => void;
  selectedPost: Post | null;
  setSelectedPost: Dispatch<SetStateAction<null>> | ((post: Post) => void);
  handleUpdatePost: () => void;
}) => {
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
              setSelectedPost({ ...selectedPost, title: e.target.value })
            }
          />
          <Textarea
            rows={15}
            placeholder="내용"
            value={selectedPost?.body || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSelectedPost({ ...selectedPost, body: e.target.value })
            }
          />
          <Button onClick={handleUpdatePost}>게시물 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
