import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, Textarea, Button } from "@shared/ui"
import { usePostComment, usePutComment } from "@entities/comment"
import type { Comment } from "@entities/comment"

interface CommentFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  formTitle: string
  mode: "create" | "edit"
  postId?: number
  initialComment?: Comment | null
  onSuccess?: () => void
}

export const CommentFormDialog: React.FC<CommentFormDialogProps> = ({
  open,
  onOpenChange,
  formTitle,
  mode,
  postId,
  initialComment,
  onSuccess,
}) => {
  const [body, setBody] = useState("")

  const addCommentMutation = usePostComment()
  const updateCommentMutation = usePutComment()

  useEffect(() => {
    if (mode === "create") {
      setBody("")
    } else if (mode === "edit" && initialComment) {
      setBody(initialComment.body || "")
    }
  }, [mode, initialComment, open])

  const handleSubmit = () => {
    if (mode === "create" && postId) {
      addCommentMutation.mutate(
        { body, postId, userId: 1 },
        {
          onSuccess: () => {
            onOpenChange(false)
            onSuccess?.()
          },
          onError: (error) => console.error("댓글 추가 오류:", error),
        }
      )
    } else if (mode === "edit" && initialComment) {
      updateCommentMutation.mutate(
        { id: initialComment.id, body, postId: initialComment.postId },
        {
          onSuccess: () => {
            onOpenChange(false)
            onSuccess?.()
          },
          onError: (error) => console.error("댓글 수정 오류:", error),
        }
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{formTitle}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea placeholder="댓글 내용" value={body} onChange={(e) => setBody(e.target.value)} />
          <Button onClick={handleSubmit}>
            {mode === "create" ? "댓글 추가" : "댓글 수정"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
