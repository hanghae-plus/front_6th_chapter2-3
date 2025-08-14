import { useState, type ChangeEvent } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, Textarea, Button } from "@shared/ui"

interface AddCommentDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (body: string) => void
}

export const AddCommentDialog = ({ isOpen, onClose, onConfirm }: AddCommentDialogProps) => {
  const [body, setBody] = useState("")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={body}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setBody(e.target.value)}
          />
          <Button onClick={() => onConfirm(body)} disabled={!body.trim()}>
            댓글 추가
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
