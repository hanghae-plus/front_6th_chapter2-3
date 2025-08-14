import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/ui"
import { highlightText } from "../../../shared/lib"
import type { Post } from "../../../entities/post/model"
import { CommentList } from "../../../entities/comment/ui"
import { useQuery, useMutation } from "@tanstack/react-query"
import { commentQueries } from "../../../entities/comment/api/queries"
import { commentMutations } from "../../../entities/comment/api/mutations"
import type { CommentItem } from "../../../entities/comment/model"
import { useAddComment } from "../../../features/comment/add-comment"
import { useEditComment } from "../../../features/comment/edit-comment/lib/useEditComment"
import { useDeleteComment } from "../../../features/comment/delete-comment"

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

  const likeCommentMutation = useMutation({ ...commentMutations.likeMutation() })
  const likeComment = (id: number) => {
    const currentLikes = comments.find((c: CommentItem) => c.id === id)?.likes ?? 0
    likeCommentMutation.mutate({ id, postId: post.id, likes: currentLikes + 1 })
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
            onDeleteComment={(id) => deleteComment(post.id, id)}
            onLikeComment={likeComment}
          />
        </div>
        {editOverlay}
        {addCommentOverlay}
      </DialogContent>
    </Dialog>
  )
}
