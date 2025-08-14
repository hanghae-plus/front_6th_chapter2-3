import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, Textarea, Button } from "@shared/ui"
import { useEditCommentForm } from "../model"
import { useDialogStore } from "@/app/store/dialog-store"

export const EditCommentFormDialog: React.FC = () => {
  const open = useDialogStore((s) => s.isEditCommentOpen)
  const initialComment = useDialogStore((s) => s.editingComment)
  const close = useDialogStore((s) => s.closeEditComment)
  const { formData, formActions, handleSubmit, isLoading, hasInitialComment, canSubmit } = useEditCommentForm(
    initialComment,
    open,
  )

  const onSubmit = () => {
    handleSubmit({
      onSuccess: close,
      onError: (error) => console.error("댓글 수정 오류:", error),
    })
  }

  if (!hasInitialComment) return null

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={formData.body}
            onChange={(e) => formActions.setBody(e.target.value)}
          />
          <Button onClick={onSubmit} disabled={isLoading || !canSubmit}>
            {isLoading ? "수정 중..." : "댓글 수정"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
