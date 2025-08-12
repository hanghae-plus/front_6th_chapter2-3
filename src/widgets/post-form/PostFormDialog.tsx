import React from "react"
import { Dialog } from "@shared/ui"
import type { Post } from "@entities/post"
import { AddPostForm, EditPostForm } from "@features"

interface PostFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  initialPost?: Post | null
  onSuccess?: () => void
}

export const PostFormDialog: React.FC<PostFormDialogProps> = ({ open, onOpenChange, mode, initialPost, onSuccess }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {mode === "create" ? (
        <AddPostForm open={open} onOpenChange={onOpenChange} onSuccess={onSuccess} />
      ) : (
        <EditPostForm open={open} onOpenChange={onOpenChange} initialPost={initialPost} onSuccess={onSuccess} />
      )}
    </Dialog>
  )
}
