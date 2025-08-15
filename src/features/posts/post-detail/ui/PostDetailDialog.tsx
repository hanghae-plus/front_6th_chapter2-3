import { Dialog, DialogContent, DialogTitle } from "../../../../shared/ui"
import { ReactNode } from "react"
import { useSearchFilter, usePostDialogs } from "../../../../shared/store"
import { DialogHeader, highlightText } from "../../../../shared/ui"
import { useSelectedPost } from "../../model"

interface PostDetailDialogProps {
  children: ReactNode
}

export const PostDetailDialog = (props: PostDetailDialogProps) => {
  const { selectedPost } = useSelectedPost()
  const { searchQuery } = useSearchFilter()
  const { showPostDetailDialog, setShowPostDetailDialog } = usePostDialogs()

  if (!selectedPost) return

  return (
    <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(selectedPost?.title, searchQuery)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{highlightText(selectedPost?.body, searchQuery)}</p>
          {props.children}
        </div>
      </DialogContent>
    </Dialog>
  )
}
