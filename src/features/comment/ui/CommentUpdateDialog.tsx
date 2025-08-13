import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "../../../shared/ui";
import { Comment } from "../../../entities/comment/types";
import { Dispatch, SetStateAction } from "react";

export const CommentUpdateDialog = ({
  showEditCommentDialog,
  setShowEditCommentDialog,
  selectedComment,
  setSelectedComment,
  handleUpdateComment,
}: {
  showEditCommentDialog: boolean;
  setShowEditCommentDialog: (show: boolean) => void;
  selectedComment: Comment | null;
  setSelectedComment: Dispatch<SetStateAction<Comment | null>>;
  handleUpdateComment: () => void;
}) => {
  return (
    <Dialog open={showEditCommentDialog} onOpenChange={setShowEditCommentDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={selectedComment?.body || ""}
            onChange={(e) => setSelectedComment({ ...selectedComment, body: e.target.value })}
          />
          <Button onClick={handleUpdateComment}>댓글 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
