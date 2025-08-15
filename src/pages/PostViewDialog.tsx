import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components"
import { useApp } from "../hooks/useApp"
import { useQueryParams } from "../hooks/useQueryParams"
import { CommentsList } from "./CommentsList"
import { highlightText } from "./highlightText"

export function PostViewDialog() {
  const {
    selectedPost,
    showPostViewDialog: showPostDetailDialog,
    setShowPostViewDialog: setShowPostDetailDialog,
  } = useApp()
  const { searchQuery } = useQueryParams()

  return (
    <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(selectedPost?.title, searchQuery)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{highlightText(selectedPost?.body, searchQuery)}</p>
          <CommentsList post={selectedPost} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
