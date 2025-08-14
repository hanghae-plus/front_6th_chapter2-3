import { FormEvent } from "react"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "../../../shared/ui"

interface CommentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (e: FormEvent) => void
  commentBody: string
  setCommentBody: (body: string) => void
  isEdit?: boolean
}

export const CommentDialog = ({
  open,
  onOpenChange,
  onSubmit,
  commentBody,
  setCommentBody,
  isEdit = false,
}: CommentDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{isEdit ? "댓글 수정" : "새 댓글 추가"}</DialogTitle>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">댓글 내용</label>
          <Textarea
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
            placeholder="댓글을 입력하세요"
            required
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button type="submit">{isEdit ? "수정" : "추가"}</Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
)
