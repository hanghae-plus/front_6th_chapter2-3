import { CommentFormEdit } from "@/features/comment/ui/CommentFormEdit.tsx"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui"
import { useCommentDialog } from "@/features/comment/model/useCommentDialog.ts"

export function CommentDialogEdit() {
  const { showEditCommentDialog, setShowEditCommentDialog } = useCommentDialog()

  return (
    <Dialog open={showEditCommentDialog} onOpenChange={setShowEditCommentDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>

        <CommentFormEdit />
      </DialogContent>
    </Dialog>
  )
}
