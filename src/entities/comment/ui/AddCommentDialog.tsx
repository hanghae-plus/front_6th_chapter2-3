import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/ui/Dialog"
import { Button } from "../../../shared/ui/Button"
import { Textarea } from "../../../shared/ui/Textarea"

interface AddCommentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: () => void
  newComment: { body: string; postId: number | null; userId: number }
  setNewComment: (comment: { body: string; postId: number | null; userId: number }) => void
}

const AddCommentDialog = ({ open, onOpenChange, onAdd, newComment, setNewComment }: AddCommentDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <Button onClick={onAdd}>댓글 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddCommentDialog
