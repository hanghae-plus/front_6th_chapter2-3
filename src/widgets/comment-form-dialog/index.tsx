import React from "react"
import { Dialog } from "@shared/ui"
import type { Comment } from "@entities/comment"
import { AddCommentForm, EditCommentForm } from "@features"

interface CommentFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  postId?: number
  initialComment?: Comment | null
  onSuccess?: () => void
}

export const CommentFormDialog: React.FC<CommentFormDialogProps> = ({
  open,
  onOpenChange,
  mode,
  postId,
  initialComment,
  onSuccess,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {mode === "create" ? (
        <AddCommentForm open={open} onOpenChange={onOpenChange} postId={postId} onSuccess={onSuccess} />
      ) : (
        <EditCommentForm open={open} onOpenChange={onOpenChange} initialComment={initialComment} onSuccess={onSuccess} />
      )}
    </Dialog>
  )
}
