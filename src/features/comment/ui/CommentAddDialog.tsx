import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "../../../shared/ui";
import { Comment } from "../../../entities/comment/types";
import { Dispatch, SetStateAction } from "react";
import { showAddCommentDialogAtom } from "../models/dialog.atoms";
import { useAtom } from "jotai";

export const CommentAddDialog = ({
  newComment,
  setNewComment,
  handleAddComment,
}: {
  newComment: Partial<Comment>;
  setNewComment: Dispatch<SetStateAction<Partial<Comment>>>;
  handleAddComment: () => void;
}) => {
  const [showAddCommentDialog, setShowAddCommentDialog] = useAtom(showAddCommentDialogAtom);
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
