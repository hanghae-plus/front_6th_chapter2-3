import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, Textarea, Button } from "@shared/ui"
import { useAddCommentForm } from "../model"
import { useCommentDialogStore } from "@/features/comment-dialog"

export const AddCommentFormDialog: React.FC = () => {
  const open = useCommentDialogStore((s) => s.isAddCommentOpen)
  const postId = useCommentDialogStore((s) => s.postIdForAdd)
  const close = useCommentDialogStore((s) => s.closeAddComment)

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <InternalForm open={open} onOpenChange={(o) => !o && close()} postId={postId ?? undefined} />
    </Dialog>
  )
}

interface InternalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  postId?: number
  onSuccess?: () => void
}

const InternalForm: React.FC<InternalProps> = ({ open, onOpenChange, postId, onSuccess }) => {
  const { formData, formActions, handleSubmit, isLoading, canSubmit } = useAddCommentForm(open, postId)

  const onSubmit = () => {
    handleSubmit({
      onSuccess: () => {
        onOpenChange(false)
        onSuccess?.()
      },
      onError: (error) => console.error("댓글 추가 오류:", error),
    })
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>댓글 추가</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <Textarea placeholder="댓글 내용" value={formData.body} onChange={(e) => formActions.setBody(e.target.value)} />
        <Button onClick={onSubmit} disabled={isLoading || !canSubmit}>
          {isLoading ? "추가 중..." : "댓글 추가"}
        </Button>
      </div>
    </DialogContent>
  )
}
