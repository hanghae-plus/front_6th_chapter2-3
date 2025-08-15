import { Comment } from "@entities/comment/types"
import { useEditComment } from "@entities/comment/hooks/mutations/useEditComment"
import { Button } from "@shared/components/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@shared/components/dialog"
import { Textarea } from "@shared/components/textarea"
import { useState } from "react"

interface EditCommentDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  comment: Comment
}

export const EditCommentDialog = ({ isOpen, onOpenChange, comment }: EditCommentDialogProps) => {
  const [selectedComment, setSelectedComment] = useState<Comment>(comment)
  const { mutate: updateComment } = useEditComment()

  const handleUpdateComment = () => {
    updateComment({
      id: selectedComment.id,
      body: selectedComment.body,
      postId: selectedComment.postId,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={selectedComment.body || ""}
            onChange={(e) => setSelectedComment({ ...selectedComment, body: e.target.value })}
          />
          <Button onClick={handleUpdateComment}>댓글 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
