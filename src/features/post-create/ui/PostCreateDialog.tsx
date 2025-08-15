import { FormEvent } from "react"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "../../../shared/ui"

interface PostCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (e: FormEvent) => void
  post: { title: string; body: string; userId?: number }
  setPost: (post: { title: string; body: string; userId?: number }) => void
}

export const PostCreateDialog = ({ open, onOpenChange, onSubmit, post, setPost }: PostCreateDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>새 게시물 추가</DialogTitle>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">제목</label>
          <Input
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            placeholder="제목을 입력하세요"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">내용</label>
          <Textarea
            value={post.body}
            onChange={(e) => setPost({ ...post, body: e.target.value })}
            placeholder="내용을 입력하세요"
            required
            rows={10}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">사용자 ID</label>
          <Input
            type="number"
            value={post.userId}
            onChange={(e) => setPost({ ...post, userId: Number(e.target.value) })}
            placeholder="사용자 ID를 입력하세요"
            required
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button type="submit">추가</Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
)
