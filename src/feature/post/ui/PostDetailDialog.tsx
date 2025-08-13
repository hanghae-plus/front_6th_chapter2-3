import React from "react"
import { Dialog, HighlightText } from "../../../shared/ui"
import { useSearchQueryStore, useSelectedPostStore } from "../model/store"

export const PostDetailDialog = ({ children }: { children: React.ReactNode }) => {
  const { searchQuery } = useSearchQueryStore()
  const { showPostDetailDialog, setShowPostDetailDialog, selectedPost } = useSelectedPostStore()
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
