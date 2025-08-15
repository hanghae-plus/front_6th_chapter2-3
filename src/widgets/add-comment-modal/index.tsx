import { useAtom, useAtomValue } from "jotai"
import { isAddCommentModalOpenAtom } from "../../features/add-comment/model/atoms"
import AddCommentForm from "../../features/add-comment/ui/AddCommentForm"
import { detailPostAtom } from "../../features/view-post-detail/model/atoms"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../shared/ui"

const AddCommentModal = () => {
  const [isOpen, setIsOpen] = useAtom(isAddCommentModalOpenAtom)
  const detailPost = useAtomValue(detailPostAtom)

  const handleSubmitSuccess = () => {
    setIsOpen(false)
  }

  if (!detailPost) return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <AddCommentForm postId={detailPost.id} onSubmitSuccess={handleSubmitSuccess} />
      </DialogContent>
    </Dialog>
  )
}

export default AddCommentModal
