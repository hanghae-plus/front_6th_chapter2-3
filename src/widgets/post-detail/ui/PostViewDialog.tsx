import { PostWithUser } from "@/entities/post/model"
import { CommentManagement } from "@/features/comment-management/ui/CommentManagement"
import { useDialog } from "@/shared/hook/useDialog"
import { highlightText } from "@/shared/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog"

interface PostViewDialogProps {
  post: PostWithUser
  searchTerm: string
}

export const PostViewDialog = ({ post, searchTerm }: PostViewDialogProps) => {
  const { open: openPostViewDialog, isOpen: isPostViewDialogOpen } = useDialog("post-view")
  return (
    <Dialog onOpenChange={openPostViewDialog} open={isPostViewDialogOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(post.title, searchTerm ?? "")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{highlightText(post.body, searchTerm ?? "")}</p>
          <CommentManagement postId={post.id} searchTerm={searchTerm} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
