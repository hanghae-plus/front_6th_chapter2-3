import { ThumbsUp, ThumbsDown } from "lucide-react"
import type { Comment } from "@/entities/comment/model"
import { Button } from "@/shared/ui"
import { useLikeComment, useDislikeComment } from "../model/mutations"

interface CommentReactionButtonsProps {
  comment: Comment
  onSuccess?: () => void
}

export const CommentReactionButtons = ({ comment, onSuccess }: CommentReactionButtonsProps) => {
  const likeCommentMutation = useLikeComment()
  const dislikeCommentMutation = useDislikeComment()

  const handleLike = async () => {
    try {
      await likeCommentMutation.mutateAsync(comment.id)
      onSuccess?.()
    } catch (error) {
      console.error("좋아요 실패:", error)
    }
  }

  const handleDislike = async () => {
    try {
      await dislikeCommentMutation.mutateAsync(comment.id)
      onSuccess?.()
    } catch (error) {
      console.error("싫어요 실패:", error)
    }
  }

  return (
    <div className="flex gap-2 items-center">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        disabled={likeCommentMutation.isPending}
        className="flex items-center gap-1"
      >
        <ThumbsUp className="w-4 h-4" />
        <span>{comment.likes || 0}</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleDislike}
        disabled={dislikeCommentMutation.isPending}
        className="flex items-center gap-1"
      >
        <ThumbsDown className="w-4 h-4" />
        <span>{comment.dislikes || 0}</span>
      </Button>
    </div>
  )
}
