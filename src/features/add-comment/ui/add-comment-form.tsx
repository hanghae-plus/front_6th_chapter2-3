import React from "react"
import { DialogContent, DialogHeader, DialogTitle, Textarea, Button } from "@shared/ui"
import { useAddCommentForm } from "@/features/add-comment/model"

export interface AddCommentFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  postId?: number
  onSuccess?: () => void
}

export const AddCommentForm: React.FC<AddCommentFormProps> = ({ open, onOpenChange, postId, onSuccess }) => {
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
