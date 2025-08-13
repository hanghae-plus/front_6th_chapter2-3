import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, Textarea, Button } from "../../../../shared/ui"

interface EditCommentDialogProps {
  isOpen: boolean
  onClose: () => void
  initialBody: string
  onConfirm: (body: string) => void
}

export const EditCommentDialog = ({ isOpen, onClose, initialBody, onConfirm }: EditCommentDialogProps) => {
  const [body, setBody] = useState(initialBody)

  useEffect(() => {
    setBody(initialBody)
  }, [initialBody])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea placeholder="댓글 내용" value={body} onChange={(e) => setBody(e.target.value)} />
          <Button onClick={() => onConfirm(body)}>댓글 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
