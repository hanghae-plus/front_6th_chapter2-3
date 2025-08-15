import { useAtom } from "jotai"
import { isAddPostModalOpenAtom } from "../../features/add-post/model/atoms"
import AddPostForm from "../../features/add-post/ui/AddPostForm"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../shared/ui"

const AddPostModal = () => {
  const [isOpen, setIsOpen] = useAtom(isAddPostModalOpenAtom)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 게시물 추가</DialogTitle>
        </DialogHeader>
        <AddPostForm />
      </DialogContent>
    </Dialog>
  )
}

export default AddPostModal

export default AddPostModal
