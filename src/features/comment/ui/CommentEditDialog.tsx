import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui";
import { Textarea } from "@/shared/ui";
import { Button } from "@/shared/ui";
import { CommentType } from "@/entities/comment/model/types";
import { useUpdateCommentMutation } from "@/entities/comment/api/hooks";

interface CommentEditDialogProps {
  open: boolean;
  onClose: () => void;
  selectedComment: CommentType | null;
  setSelectedComment: (comment: CommentType | null) => void;
}

export const CommentEditDialog = ({
  open,
  onClose,
  selectedComment,
  setSelectedComment,
}: CommentEditDialogProps) => {
  const updateCommentMutation = useUpdateCommentMutation();

  const updateComment = () => {
    if (!selectedComment?.id || !selectedComment.body.trim()) return;

    updateCommentMutation.mutate(
      {
        id: selectedComment.id,
        body: selectedComment.body,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={selectedComment?.body || ""}
            onChange={(e) =>
              setSelectedComment(
                selectedComment
                  ? { ...selectedComment, body: e.target.value }
                  : null,
              )
            }
          />
          <Button onClick={updateComment}>댓글 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
