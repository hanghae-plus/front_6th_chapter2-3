import { CommentFormAdd } from "@/features/comment/ui/CommentFormAdd.tsx"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui"
import { useCommentDialog } from "@/features/comment/model/useCommentDialog.ts"

export function CommentDialogAdd() {
  const { showAddCommentDialog, setShowAddCommentDialog } = useCommentDialog()
  const isOpen = showAddCommentDialog !== null

  function handleClose() {
    setShowAddCommentDialog(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <CommentFormAdd />
      </DialogContent>
    </Dialog>
  )
}
