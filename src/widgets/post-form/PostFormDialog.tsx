import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea, Button } from "@shared/ui"

interface PostFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  formTitle: string
  titleValue: string
  bodyValue: string
  onTitleChange: (value: string) => void
  onBodyChange: (value: string) => void
  showUserId?: boolean
  userIdValue?: number
  onUserIdChange?: (value: number) => void
  submitLabel: string
  onSubmit: () => void
}

export const PostFormDialog: React.FC<PostFormDialogProps> = ({
  open,
  onOpenChange,
  formTitle,
  titleValue,
  bodyValue,
  onTitleChange,
  onBodyChange,
  showUserId = false,
  userIdValue,
  onUserIdChange,
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
          <Input placeholder="제목" value={titleValue} onChange={(e) => onTitleChange(e.target.value)} />
          <Textarea
            rows={showUserId ? 30 : 15}
            placeholder="내용"
            value={bodyValue}
            onChange={(e) => onBodyChange(e.target.value)}
          />
          {showUserId && (
            <Input
              type="number"
              placeholder="사용자 ID"
              value={userIdValue}
              onChange={(e) => onUserIdChange && onUserIdChange(Number(e.target.value))}
            />
          )}
          <Button onClick={onSubmit}>{submitLabel}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
