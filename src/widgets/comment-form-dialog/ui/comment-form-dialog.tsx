import React from "react"
import type { Comment } from "@entities/comment"
import { AddCommentFormDialog, EditCommentFormDialog } from "@features"

interface CommentFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  postId?: number
  initialComment?: Comment | null
  onSuccess?: () => void
}

export const CommentFormDialog: React.FC<CommentFormDialogProps> = ({
  mode,
}) => {
  return (
    <>
      {mode === "create" ? (
        <AddCommentFormDialog />
      ) : (
        <EditCommentFormDialog />
      )}
    </>
  )
}
