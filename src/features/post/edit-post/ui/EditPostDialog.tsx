import { useState, type ChangeEvent } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea, Button } from "../../../../shared/ui"
import type { Post } from "../../../../entities/post/model"

interface EditPostDialogProps {
  isOpen: boolean
  onClose: () => void
  initialPost: Post
  onConfirm: (post: Post) => void
}

export const EditPostDialog = ({ isOpen, onClose, initialPost, onConfirm }: EditPostDialogProps) => {
  const [draft, setDraft] = useState<Post>(initialPost)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={draft.title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setDraft({ ...draft, title: e.target.value })}
          />
          <Textarea
            rows={15}
            placeholder="내용"
            value={draft.body}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDraft({ ...draft, body: e.target.value })}
          />
          <Button onClick={() => onConfirm(draft)}>게시물 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
