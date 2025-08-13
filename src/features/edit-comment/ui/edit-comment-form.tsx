import React from "react"
import { DialogContent, DialogHeader, DialogTitle, Textarea, Button } from "@shared/ui"
import { useEditCommentForm } from "@/features/edit-comment/model"
import type { Comment } from "@entities/comment"

interface EditCommentFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialComment?: Comment | null
  onSuccess?: () => void
}

export const EditCommentForm: React.FC<EditCommentFormProps> = ({ open, onOpenChange, initialComment, onSuccess }) => {
  const { formData, formActions, handleSubmit, isLoading, hasInitialComment, canSubmit } = useEditCommentForm(
    initialComment,
    open,
  )

  const onSubmit = () => {
    handleSubmit({
      onSuccess: () => {
        onOpenChange(false)
        onSuccess?.()
      },
      onError: (error) => console.error("댓글 수정 오류:", error),
    })
  }

  if (!hasInitialComment) {
    return null
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>댓글 수정</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <Textarea placeholder="댓글 내용" value={formData.body} onChange={(e) => formActions.setBody(e.target.value)} />
        <Button onClick={onSubmit} disabled={isLoading || !canSubmit}>
          {isLoading ? "수정 중..." : "댓글 수정"}
        </Button>
      </div>
    </DialogContent>
  )
}
