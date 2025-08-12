import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea, Button } from "@shared/ui"
import { usePostPost, usePutPost } from "@entities/post"
import type { Post } from "@entities/post"

interface PostFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  formTitle: string
  mode: "create" | "edit"
  initialPost?: Post | null
  onSuccess?: () => void
}

export const PostFormDialog: React.FC<PostFormDialogProps> = ({
  open,
  onOpenChange,
  formTitle,
  mode,
  initialPost,
  onSuccess,
}) => {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [userId, setUserId] = useState(1)

  const createPostMutation = usePostPost()
  const editPostMutation = usePutPost()

  useEffect(() => {
    if (mode === "create") {
      setTitle("")
      setBody("")
      setUserId(1)
    } else if (mode === "edit" && initialPost) {
      setTitle(initialPost.title || "")
      setBody(initialPost.body || "")
      setUserId(initialPost.userId || 1)
    }
  }, [mode, initialPost, open])

  const handleSubmit = () => {
    if (mode === "create") {
      createPostMutation.mutate(
        { title, body, userId },
        {
          onSuccess: () => {
            onOpenChange(false)
            onSuccess?.()
          },
          onError: (error) => console.error("게시물 추가 오류:", error),
        }
      )
    } else if (mode === "edit" && initialPost) {
      editPostMutation.mutate(
        { id: initialPost.id, post: { title, body } },
        {
          onSuccess: () => {
            onOpenChange(false)
            onSuccess?.()
          },
          onError: (error) => console.error("게시물 수정 오류:", error),
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
          <Input placeholder="제목" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea
            rows={mode === "create" ? 30 : 15}
            placeholder="내용"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          {mode === "create" && (
            <Input
              type="number"
              placeholder="사용자 ID"
              value={userId}
              onChange={(e) => setUserId(Number(e.target.value))}
            />
          )}
          <Button onClick={handleSubmit}>
            {mode === "create" ? "게시물 추가" : "게시물 수정"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
