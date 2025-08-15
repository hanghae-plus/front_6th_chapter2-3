import { PostDTO } from "../../entities/posts/api"
import EditPostForm from "../../features/edit-post/ui/EditPostForm"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../shared/ui"

interface EditPostModalProps {
  post: PostDTO | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onUpdatePost: (post: PostDTO | null) => void
}

const EditPostModal = ({ post, isOpen, onOpenChange, onUpdatePost }: EditPostModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <EditPostForm post={post} onUpdatePost={onUpdatePost} />
      </DialogContent>
    </Dialog>
  )
}

export default EditPostModal
