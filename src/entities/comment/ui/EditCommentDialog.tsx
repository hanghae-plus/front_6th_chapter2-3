import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/ui/Dialog"
import { Button } from "../../../shared/ui/Button"
import { Textarea } from "../../../shared/ui/Textarea"
import { Comment } from "../model/types"

interface EditCommentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: () => void
  selectedComment: Comment | null
  setSelectedComment: (comment: Comment | null) => void
}

const EditCommentDialog = ({ open, onOpenChange, onUpdate, selectedComment, setSelectedComment }: EditCommentDialogProps) => {
  if (!selectedComment) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={selectedComment.body || ""}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSelectedComment({ ...selectedComment, body: e.target.value })}
          />
          <Button onClick={onUpdate}>댓글 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EditCommentDialog
