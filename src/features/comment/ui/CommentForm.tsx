import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "../../../shared/ui"
import React from "react"

interface CommentFormProps {
  open: boolean
  onChangeOpen: (open: boolean) => void
  // 새 댓글 추가 or 댓글 수정
  formTitle: string
  bodyValue: string
  onChangeBody: (value: string) => void
  // 댓글 추가 or 댓글 업데이트
  submitActionLabel: string
  onSubmit: () => void
}

export const CommentForm: React.FC<CommentFormProps> = ({
  open,
  onChangeOpen,
  formTitle,
  bodyValue,
  onChangeBody,
  submitActionLabel,
  onSubmit,
  }) => {
  return (
    <Dialog open={open} onOpenChange={onChangeOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{formTitle}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={bodyValue}
            onChange={(e) => onChangeBody(e.target.value)}
          />
          <Button onClick={onSubmit}>{submitActionLabel}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}