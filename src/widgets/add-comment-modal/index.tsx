import AddCommentForm from "../../features/add-comment/ui/AddCommentForm"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../shared/ui"

interface AddCommentModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

const AddCommentModal = ({ isOpen, onOpenChange }: AddCommentModalProps) => {
  const handleSubmitSuccess = () => {
    // setComments((prev) => ({
    //   ...prev,
    //   [data.postId]: [...(prev[data.postId] || []), data],
    // }))
    onOpenChange(false)
  }
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <AddCommentForm onSubmitSuccess={handleSubmitSuccess} />
      </DialogContent>
    </Dialog>
  )
}

export default AddCommentModal
