import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "../../../shared/ui";
import { Comment } from "../../../entities/comment/types";
import { Dispatch, SetStateAction } from "react";

export const CommentAddDialog = ({
  showAddCommentDialog,
  setShowAddCommentDialog,
  newComment,
  setNewComment,
  handleAddComment,
}: {
  showAddCommentDialog: boolean;
  setShowAddCommentDialog: (show: boolean) => void;
  newComment: Partial<Comment>;
  setNewComment: Dispatch<SetStateAction<Partial<Comment>>>;
  handleAddComment: () => void;
}) => {
  return (
    <Dialog open={showAddCommentDialog} onOpenChange={setShowAddCommentDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={newComment.body}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setNewComment({ ...newComment, body: e.target.value })
            }
          />
          <Button onClick={handleAddComment}>댓글 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
