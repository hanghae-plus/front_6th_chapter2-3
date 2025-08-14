import { useState, type ChangeEvent } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea, Button } from "@shared/ui"
import type { CreatePostRequest } from "@entities/post/api/api"

interface AddPostDialogProps {
  isOpen: boolean
  onClose: () => void
  defaultUserId?: number
  onConfirm: (data: CreatePostRequest) => void
}

export const AddPostDialog = ({ isOpen, onClose, defaultUserId = 1, onConfirm }: AddPostDialogProps) => {
  const [form, setForm] = useState<CreatePostRequest>({ title: "", body: "", userId: defaultUserId })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 게시물 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={form.title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, title: e.target.value })}
          />
          <Textarea
            rows={30}
            placeholder="내용"
            value={form.body}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, body: e.target.value })}
          />
          <Input
            type="number"
            placeholder="사용자 ID"
            value={form.userId}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, userId: Number(e.target.value) })}
          />
          <Button onClick={() => onConfirm(form)}>게시물 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
