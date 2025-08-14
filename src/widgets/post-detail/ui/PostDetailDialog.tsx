import { useQuery } from "@tanstack/react-query"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@shared/ui"
import { highlightText } from "@shared/lib"
import type { Post } from "@entities/post/model"
import { CommentList } from "@entities/comment/ui"
import { commentQueries } from "@entities/comment/api/queries"
import type { CommentItem } from "@entities/comment/model"
import { useAddComment } from "@features/comment/add-comment"
import { useEditComment } from "@features/comment/edit-comment"
import { useDeleteComment } from "@features/comment/delete-comment"
import { useLikeComment } from "@features/comment/like-comment"

interface PostDetailDialogProps {
  isOpen: boolean
  onClose: () => void
  post: Post
  searchQuery: string
}

export const PostDetailDialog = ({ isOpen, onClose, post, searchQuery }: PostDetailDialogProps) => {
  const { data: comments = [] } = useQuery({
    ...commentQueries.byPostQuery(post.id),
    select: (res) => res.comments,
  })

  const { addComment, overlay: addCommentOverlay } = useAddComment()
  const { updateComment, overlay: editOverlay } = useEditComment()
  const { deleteComment } = useDeleteComment()
  const { likeComment } = useLikeComment()

  const handleLike = (id: number) => {
    const comment = comments.find((c: CommentItem) => c.id === id)
    if (comment) {
      likeComment(comment)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(post.title, searchQuery)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{highlightText(post.body, searchQuery)}</p>
          <CommentList
            comments={comments}
            searchQuery={searchQuery}
            onAddComment={() => addComment(post.id, 1)}
            onEditComment={async (comment) => {
              await updateComment(comment)
            }}
            onDeleteComment={(id) => {
              const comment = comments.find((c: CommentItem) => c.id === id)
              if (comment) {
                deleteComment(comment)
              }
            }}
            onLikeComment={handleLike}
          />
        </div>
        {editOverlay}
        {addCommentOverlay}
      </DialogContent>
    </Dialog>
  )
}
