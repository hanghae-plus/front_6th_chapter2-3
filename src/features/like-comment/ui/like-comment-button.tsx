import React from "react"
import { Button } from "@shared/ui"
import { useLikeComment, type LikeCommentCallbacks } from "../model"

export interface LikeCommentButtonProps {
  commentId: number
  postId: number
  currentLikes: number
  callbacks?: LikeCommentCallbacks
}

export const LikeCommentButton: React.FC<LikeCommentButtonProps> = ({
  commentId,
  postId,
  currentLikes,
  callbacks,
}) => {
  const { handleLike, isLoading } = useLikeComment()

  const onClick = () => {
    handleLike(commentId, postId, currentLikes, callbacks)
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={onClick}
      disabled={isLoading}
    >
      좋아요 <span className="ml-1 text-xs">{currentLikes}</span>
    </Button>
  )
}