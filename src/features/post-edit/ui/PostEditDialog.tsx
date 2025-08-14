import { FormEvent } from "react"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "../../../shared/ui"

interface PostEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (e: FormEvent) => void
  post: { title: string; body: string; id?: number; userId?: number } | null
  setPost: (post: { title: string; body: string; id?: number; userId?: number }) => void
}

export const PostEditDialog = ({ open, onOpenChange, onSubmit, post, setPost }: PostEditDialogProps) => {
  if (!post) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
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
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button type="submit">수정</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
