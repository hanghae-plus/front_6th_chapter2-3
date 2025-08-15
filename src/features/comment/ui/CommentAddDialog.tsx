import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui";
import { Textarea } from "@/shared/ui";
import { Button } from "@/shared/ui";
import { useCommentStore } from "@/entities/comment/model/store";
import { useCreateCommentMutation } from "@/entities/comment/api/hooks";

interface CommentAddDialogProps {
  open: boolean;
  onClose: () => void;
  postId: number;
}

export const CommentAddDialog = ({
  open,
  onClose,
  postId,
}: CommentAddDialogProps) => {
  const { newComment, setNewComment } = useCommentStore();

  const createCommentMutation = useCreateCommentMutation();

  const handleAddComment = () => {
    if (!newComment.body || !postId) {
      return;
    }

    const commentData = {
      body: newComment.body,
      postId: postId,
      userId: newComment.userId || 1,
    };

    createCommentMutation.mutate(commentData, {
      onSuccess: () => {
        console.log("댓글 추가 성공");
        onClose();
        setNewComment({ ...newComment, body: "" });
      },
      onError: () => {
        alert("댓글 추가에 실패했습니다.");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={newComment.body || ""}
            onChange={(e) =>
              setNewComment({ ...newComment, body: e.target.value })
            }
          />
          <Button onClick={handleAddComment}>댓글 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
