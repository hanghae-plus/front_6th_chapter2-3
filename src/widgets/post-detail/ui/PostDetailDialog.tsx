import { useQuery } from "@tanstack/react-query"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@shared/ui"
import { highlightText } from "@shared/lib"
import type { Post } from "@entities/post/model"
import { CommentList, CommentListProvider } from "@features/comment/view-comment-list"
import { commentQueries } from "@entities/comment/api/queries"
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
  const { deleteComment } = useDeleteComment(post.id)
  const { likeComment } = useLikeComment(post.id)

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
            deleteComment={deleteComment}
            likeComment={likeComment}
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
