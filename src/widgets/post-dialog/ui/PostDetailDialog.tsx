import React from "react"
import { DialogLayout } from "../../../shared/ui/index"
import { Post } from "../../../types"
import { highlightText } from "../../../lib/textHighlight"

interface PostDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedPost: Post | null
  searchQuery: string
  children: React.ReactNode
}

export const PostDetailDialog = ({
  open,
  onOpenChange,
  selectedPost,
  searchQuery,
  children,
}: PostDetailDialogProps) => {
  return (
    <DialogLayout
      open={open}
      onOpenChange={onOpenChange}
      title={highlightText(selectedPost?.title || "", searchQuery) || ""}
      className="max-w-3xl"
    >
      <div className="space-y-4">
        <p>{highlightText(selectedPost?.body || "", searchQuery)}</p>
        {children}
      </div>
    </DialogLayout>
  )
}
