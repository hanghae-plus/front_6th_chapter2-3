import React from "react"
import { Button } from "@shared/ui"
import { useRemoveComment, type RemoveCommentCallbacks } from "../model"

export interface RemoveCommentButtonProps {
  commentId: number
  postId: number
  callbacks?: RemoveCommentCallbacks
}

export const RemoveCommentButton: React.FC<RemoveCommentButtonProps> = ({
  commentId,
  postId,
  callbacks,
}) => {
  const { handleRemove, isLoading } = useRemoveComment()

  const onClick = () => {
    handleRemove(commentId, postId, callbacks)
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={onClick}
      disabled={isLoading}
    >
      삭제
    </Button>
  )
}