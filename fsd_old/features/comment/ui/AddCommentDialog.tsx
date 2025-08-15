import { CreateCommentBody, useCreateComment } from "@features/comment/model/hooks/useCreateComment"
import { Button } from "@shared/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@shared/ui/dialog"
import { Textarea } from "@shared/ui/textarea"
import { useState } from "react"

interface AddCommentDialogProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  postId: number
}

export const AddCommentDialog = ({ isOpen, onOpenChange, postId }: AddCommentDialogProps) => {
  const [newComment, setNewComment] = useState<CreateCommentBody>({
    body: "",
    postId,
    userId: 1,
  })
  const { mutate: createComment } = useCreateComment()

  const handleAddComment = () => {
    createComment(newComment)
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={newComment.body}
            onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
          />
          <Button onClick={handleAddComment}>댓글 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
