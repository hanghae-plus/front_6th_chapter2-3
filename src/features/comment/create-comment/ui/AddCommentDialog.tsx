import { useState, useEffect } from "react"
import { CreateComment } from "@/entities/comment/model"
import { Dialog, DialogContent, DialogHeader, DialogTitle, Button, Textarea } from "@/shared/ui"

interface AddCommentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  postId: number | null
  onSubmit: (comment: CreateComment) => Promise<void>
}

export const AddCommentDialog = ({ open, onOpenChange, postId, onSubmit }: AddCommentDialogProps) => {
  const [newComment, setNewComment] = useState<CreateComment>({ body: "", postId: 0, userId: 1 })

  // postId가 변경될 때 상태 초기화
  useEffect(() => {
    if (postId) {
      setNewComment((prev) => ({ ...prev, postId }))
    }
  }, [postId])

  const handleSubmit = async () => {
    if (!postId || !newComment.body.trim()) return

    try {
      await onSubmit({
        body: newComment.body,
        postId: postId,
        userId: newComment.userId,
      })

      // 성공 후 상태 초기화 및 대화상자 닫기
      setNewComment({ body: "", postId: 0, userId: 1 })
      onOpenChange(false)
    } catch (error) {
      console.error("댓글 추가 오류:", error)
    }
  }

  const handleCancel = () => {
    setNewComment({ body: "", postId: 0, userId: 1 })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={newComment.body}
            onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleCancel}>
              취소
            </Button>
            <Button onClick={handleSubmit} disabled={!newComment.body.trim()}>
              댓글 추가
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
