import { Edit2, ThumbsUp, Trash2 } from "lucide-react"

import type { Comment } from "@/entities/comment/model"
import { PostHighlightText } from "@/entities/post/ui"
import { Button } from "@/shared/ui/Button"

type CommentItemProps = {
  comment: Comment
  postId: number
  searchQuery: string
  onEditComment: (comment: Comment) => void
  onDeleteComment: (commentId: number, postId: number) => void
  onLikeComment: (commentId: number, postId: number) => void
}

export function CommentItem({
  comment,
  postId,
  searchQuery,
  onEditComment,
  onDeleteComment,
  onLikeComment,
}: CommentItemProps) {
  const handleLikeClick = () => {
    onLikeComment(comment.id, postId)
  }

  const handleEditClick = () => {
    onEditComment(comment)
  }

  const handleDeleteClick = () => {
    onDeleteComment(comment.id, postId)
  }

  return (
    <div className="flex items-center justify-between border-b pb-1 text-sm">
      <div className="flex items-center space-x-2 overflow-hidden">
        <span className="truncate font-medium">{comment.user.username}:</span>
        <span className="truncate">
          <PostHighlightText text={comment.body} highlight={searchQuery} />
        </span>
      </div>
      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="sm" onClick={handleLikeClick}>
          <ThumbsUp className="h-3 w-3" />
          <span className="ml-1 text-xs">{comment.likes}</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={handleEditClick}>
          <Edit2 className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="sm" onClick={handleDeleteClick}>
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}
