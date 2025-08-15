import { Comment } from "../../entities/comments/api"
import EditCommentForm from "../../features/edit-comment/ui/EditCommentForm"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../shared/ui"

interface EditCommentModalProps {
  comment: null | Comment
  isOpen: boolean
  onUpdateComment: (comment: Comment) => void
  onOpenChange: (open: boolean) => void
}

const EditCommentModal = ({ isOpen, onOpenChange, comment, onUpdateComment }: EditCommentModalProps) => {
  if (!comment) return null
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <EditCommentForm comment={comment} onUpdateComment={onUpdateComment} />
      </DialogContent>
    </Dialog>
  )
}

export default EditCommentModal
