import { Button, Dialog, DialogContent, Input, Textarea } from "../../../../shared/ui"
import { DialogHeader } from "../../../../shared/ui"
import { DialogTitle } from "../../../../shared/ui"
import { PostItem } from "../../../../entities/post/model"

interface UpdatePostModalProps {
  state: {
    isOpen: boolean
    selectedPost: PostItem
  }
  actions: {
    onOpenChange: (open: boolean) => void
    change: (key: string, value: string | number) => void
    update: (post: PostItem) => void
  }
}

export default function UpdatePostModal({ state, actions }: UpdatePostModalProps) {
  return (
    <Dialog open={state.isOpen} onOpenChange={actions.onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={state.selectedPost?.title || ""}
            onChange={(e) => actions.change("title", e.target.value)}
          />
          <Textarea
            rows={15}
            placeholder="내용"
            value={state.selectedPost?.body || ""}
            onChange={(e) => actions.change("body", e.target.value)}
          />
          <Button onClick={() => actions.update(state.selectedPost!)}>게시물 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
