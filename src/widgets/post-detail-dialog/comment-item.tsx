import React from "react"
import { Button } from "@shared/ui"
import { highlightText } from "@shared/lib"
import type { Comment } from "@entities/comment"
import { LikeCommentButton } from "@/features/like-comment"
import { RemoveCommentButton } from "@/features/remove-comment"

interface CommentItemProps {
  comment: Comment
  postId: number
  searchQuery?: string
  onOpenEditComment: (comment: Comment) => void
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment, postId, searchQuery = "", onOpenEditComment }) => {
  return (
    <div className="flex items-center justify-between text-sm border-b pb-1">
      <div className="flex items-center space-x-2 overflow-hidden">
        <span className="font-medium truncate">{comment.user.username}:</span>
        <span className="truncate">{highlightText(comment.body, searchQuery)}</span>
      </div>
      <div className="flex items-center space-x-1">
        <LikeCommentButton commentId={comment.id} postId={postId} currentLikes={comment.likes || 0} />
        <Button variant="ghost" size="sm" onClick={() => onOpenEditComment(comment)}>
          수정
        </Button>
        <RemoveCommentButton commentId={comment.id} postId={postId} />
      </div>
    </div>
  )
}
