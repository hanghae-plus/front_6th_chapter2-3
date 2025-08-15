import AddPostForm from "../../features/add-post/ui/AddPostForm"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../shared/ui"

interface AddPostModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onAddPost: () => void
}

const AddPostModal = ({ isOpen, onOpenChange, onAddPost }: AddPostModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
