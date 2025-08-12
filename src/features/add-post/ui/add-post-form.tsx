import React from "react"
import { Input, Textarea, Button, DialogContent, DialogHeader } from "@shared/ui"
import { DialogTitle } from "@radix-ui/react-dialog"
import { useAddPostForm } from "../model"

export interface AddPostFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export const AddPostForm: React.FC<AddPostFormProps> = ({ open, onOpenChange, onSuccess }) => {
  const { formData, formActions, handleSubmit, isLoading } = useAddPostForm(open)

  const onSubmit = () => {
    handleSubmit({
      onSuccess: () => {
        onOpenChange(false)
        onSuccess?.()
      },
      onError: (error) => console.error("게시물 추가 오류:", error),
    })
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>새 게시물 추가</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <Input placeholder="제목" value={formData.title} onChange={(e) => formActions.setTitle(e.target.value)} />
        <Textarea
          rows={30}
          placeholder="내용"
          value={formData.body}
          onChange={(e) => formActions.setBody(e.target.value)}
        />
        <Input
          type="number"
          placeholder="사용자 ID"
          value={formData.userId}
          onChange={(e) => formActions.setUserId(Number(e.target.value))}
        />
        <Button onClick={onSubmit} disabled={isLoading}>
          {isLoading ? "추가 중..." : "게시물 추가"}
        </Button>
      </div>
    </DialogContent>
  )
}
