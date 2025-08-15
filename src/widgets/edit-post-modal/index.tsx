import { useAtom } from "jotai"
import { editingPostAtom, isEditPostModalOpenAtom } from "../../features/edit-post/model/atoms"
import EditPostForm from "../../features/edit-post/ui/EditPostForm"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../shared/ui"

const EditPostModal = () => {
  const [isOpen, setIsOpen] = useAtom(isEditPostModalOpenAtom)
  const [post] = useAtom(editingPostAtom)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <EditPostForm post={post} />
      </DialogContent>
    </Dialog>
  )
}

export default EditPostModal
