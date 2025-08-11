import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, Textarea, Button } from "../../shared/ui"

interface CommentFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  formTitle: string
  bodyValue: string
  onBodyChange: (value: string) => void
  submitLabel: string
  onSubmit: () => void
}

export const CommentFormDialog: React.FC<CommentFormDialogProps> = ({
  open,
  onOpenChange,
  formTitle,
  bodyValue,
  onBodyChange,
  submitLabel,
  onSubmit,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{formTitle}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea placeholder="댓글 내용" value={bodyValue} onChange={(e) => onBodyChange(e.target.value)} />
          <Button onClick={onSubmit}>{submitLabel}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
