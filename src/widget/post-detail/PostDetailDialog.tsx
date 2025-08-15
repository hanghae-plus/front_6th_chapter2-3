import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../shared/ui"
import { PostItem } from "../../entities/post/model/types"
import { User } from "../../entities/user/model/types"
import { CommentSection } from "../comment-list"
import { Comment } from "../../entities/comment/model/types"

interface PostDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post: (PostItem & { author?: User }) | null
  onAddComment: () => void
  onEditComment: (comment: Comment) => void
}

export const PostDetailDialog = ({ open, onOpenChange, post, onAddComment, onEditComment }: PostDetailDialogProps) => {
  if (!post) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{post.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{post.body}</p>
          {post.id && <CommentSection postId={post.id} onAddComment={onAddComment} onEditComment={onEditComment} />}
        </div>
      </DialogContent>
    </Dialog>
  )
}
