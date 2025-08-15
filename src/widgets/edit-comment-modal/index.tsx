import { useAtom } from "jotai"
import { Comment } from "../../entities/comments/api"
import { editingCommentAtom, isEditCommentModalOpenAtom } from "../../features/edit-comment/model/atoms"
import EditCommentForm from "../../features/edit-comment/ui/EditCommentForm"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../shared/ui"

interface EditCommentModalProps {
  onUpdateComment: (comment: Comment) => void
}

const EditCommentModal = ({ onUpdateComment }: EditCommentModalProps) => {
  const [isOpen, setIsOpen] = useAtom(isEditCommentModalOpenAtom)
  const [comment] = useAtom(editingCommentAtom)

  if (!comment) return null
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
