import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, Button, Textarea } from "@/shared/ui"
import type { Comment } from "@/shared/types"

interface EditCommentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  comment: Comment | null
  onUpdate: (commentId: number, body: string) => Promise<void>
}

export const EditCommentDialog = ({ open, onOpenChange, comment, onUpdate }: EditCommentDialogProps) => {
  const [body, setBody] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // comment가 변경될 때마다 body 초기화
  useEffect(() => {
    if (comment) {
      setBody(comment.body)
    }
  }, [comment])

  const handleSubmit = async () => {
    if (!comment || !body.trim()) return

    setIsSubmitting(true)
    try {
      await onUpdate(comment.id, body)
      onOpenChange(false)
      setBody("")
    } catch (error) {
      console.error("댓글 수정 오류:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
    setBody("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea placeholder="댓글 내용" value={body} onChange={(e) => setBody(e.target.value)} rows={4} />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleCancel}>
              취소
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting || !body.trim()}>
              {isSubmitting ? "수정 중..." : "댓글 수정"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
