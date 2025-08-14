import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea, Button } from "@shared/ui"
import { useDialogStore } from "@/app/store/dialog-store"
import { useEditPostForm } from "../model"

export const EditPostFormDialog: React.FC = () => {
  const open = useDialogStore((s) => s.isEditPostOpen)
  const post = useDialogStore((s) => s.editingPost)
  const close = useDialogStore((s) => s.closeEditPost)

  const { formData, formActions, handleSubmit, isLoading } = useEditPostForm(post, open)

  if (!post) return null

  const onSubmit = () => {
    handleSubmit({
      onSuccess: close,
      onError: (error) => console.error("게시물 수정 오류:", error),
    })
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
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
    </Dialog>
  )
}
