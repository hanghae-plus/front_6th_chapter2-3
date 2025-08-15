import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "../../../../shared/ui"
import { AddPostRequest } from "../../../../entities/post/model"

interface AddPostModalProps {
  state: {
    isOpen: boolean
    title: string
    body: string
    userId: number
  }
  actions: {
    onOpenChange: (open: boolean) => void
    change: (key: string, value: string | number) => void
    add: (post: AddPostRequest) => void
  }
}

export default function AddPostModal({ state, actions }: AddPostModalProps) {
  return (
    <Dialog open={state.isOpen} onOpenChange={actions.onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 게시물 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="제목" value={state.title} onChange={(e) => actions.change("title", e.target.value)} />
          <Textarea
            rows={30}
            placeholder="내용"
            value={state.body}
            onChange={(e) => actions.change("body", e.target.value)}
          />
          <Input
            type="number"
            placeholder="사용자 ID"
            value={state.userId}
            onChange={(e) => actions.change("userId", Number(e.target.value))}
          />
          <Button onClick={() => actions.add({ title: state.title, body: state.body, userId: state.userId })}>
            게시물 추가
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
