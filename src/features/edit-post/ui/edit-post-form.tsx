import React from "react"
import { DialogContent, DialogHeader, DialogTitle, Input, Textarea, Button } from "@shared/ui"
import { useEditPostForm } from "../model"
import { Post } from "@/entities/post"

interface EditPostFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialPost?: Post | null
  onSuccess?: () => void
}

export const EditPostForm: React.FC<EditPostFormProps> = ({ open, onOpenChange, initialPost, onSuccess }) => {
  const { formData, formActions, handleSubmit, isLoading, hasInitialPost } = useEditPostForm(initialPost, open)

  const onSubmit = () => {
    handleSubmit({
      onSuccess: () => {
        onOpenChange(false)
        onSuccess?.()
      },
      onError: (error) => console.error("게시물 수정 오류:", error),
    })
  }

  if (!hasInitialPost) {
    return null
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>게시물 수정</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <Input placeholder="제목" value={formData.title} onChange={(e) => formActions.setTitle(e.target.value)} />
        <Textarea
          rows={15}
          placeholder="내용"
          value={formData.body}
          onChange={(e) => formActions.setBody(e.target.value)}
        />
        <Button onClick={onSubmit} disabled={isLoading}>
          {isLoading ? "수정 중..." : "게시물 수정"}
        </Button>
      </div>
    </DialogContent>
  )
}
