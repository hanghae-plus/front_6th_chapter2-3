import { useAtom } from "jotai"
import AddPostForm from "../../features/add-post/ui/AddPostForm"
import { isAddPostModalOpenAtom } from "../../features/add-post/model/atoms"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../shared/ui"

interface AddPostModalProps {
  onAddPost: (post: { title: string; body: string; userId: number }) => void
}

const AddPostModal = ({ onAddPost }: AddPostModalProps) => {
  const [isOpen, setIsOpen] = useAtom(isAddPostModalOpenAtom)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 게시물 추가</DialogTitle>
        </DialogHeader>
        <AddPostForm onAddPost={onAddPost} />
      </DialogContent>
    </Dialog>
  )
}

export default AddPostModal
