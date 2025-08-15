import { useAtom } from "jotai"
import { editingCommentAtom, isEditCommentModalOpenAtom } from "../../features/edit-comment/model/atoms"
import EditCommentForm from "../../features/edit-comment/ui/EditCommentForm"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../shared/ui"

const EditCommentModal = () => {
  const [isOpen, setIsOpen] = useAtom(isEditCommentModalOpenAtom)
  const [comment] = useAtom(editingCommentAtom)

  if (!comment) return null
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <EditCommentForm comment={comment} />
      </DialogContent>
    </Dialog>
  )
}

export default EditCommentModal
