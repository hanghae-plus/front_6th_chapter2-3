import React from "react"
import { Dialog, HighlightText } from "../../../shared/ui"
import { Post } from "../type"

export const PostDetailDialog = ({
  showPostDetailDialog,
  setShowPostDetailDialog,
  selectedPost,
  searchQuery,
  children
}: {
  showPostDetailDialog: boolean
  setShowPostDetailDialog: React.Dispatch<React.SetStateAction<boolean>>
  selectedPost: Post
  searchQuery: string
  children: React.ReactNode
}) => {

  return (
    <Dialog
      open={showPostDetailDialog}
      handleChange={setShowPostDetailDialog}
      title={HighlightText(selectedPost?.title, searchQuery) ?? ""}
    >
      <div className="space-y-4">
        <p>{HighlightText(selectedPost?.body, searchQuery)}</p>
        {children}
      </div>
    </Dialog>
  )
}
