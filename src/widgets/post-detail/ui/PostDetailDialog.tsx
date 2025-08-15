import { useQuery } from "@tanstack/react-query"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@shared/ui"
import { highlightText } from "@shared/lib"
import type { Post } from "@entities/post/model"
import { CommentList, CommentListProvider } from "@features/comment/view-comment-list"
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
          <CommentListProvider
            addComment={() => addComment(post.id, 1)}
            editComment={async (comment) => {
              await updateComment(comment)
            }}
            deleteComment={(id) => {
              const comment = comments.find((c: CommentItem) => c.id === id)
              if (comment) {
                deleteComment(comment)
              }
            }}
            likeComment={handleLike}
          >
            <CommentList comments={comments} searchQuery={searchQuery} />
          </CommentListProvider>
        </div>
        {editOverlay}
        {addCommentOverlay}
      </DialogContent>
    </Dialog>
  )
}
