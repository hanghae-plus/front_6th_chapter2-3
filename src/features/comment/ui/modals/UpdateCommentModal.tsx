import { Comment } from "../../../../entities/comment/model"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../../shared/ui"
import { Textarea } from "../../../../shared/ui"
import { Button } from "../../../../shared/ui"

interface UpdateCommentModalProps {
  state: {
    isOpen: boolean
    selectedComment: Comment
  }
  actions: {
    onOpenChange: (open: boolean) => void
    change: (body: string) => void
    update: (comment: Comment) => void
  }
}

export default function UpdateCommentModal({ state, actions }: UpdateCommentModalProps) {
  return (
    <Dialog open={state.isOpen} onOpenChange={actions.onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={state.selectedComment?.body || ""}
            onChange={(e) => actions.change(e.target.value)}
          />
          <Button onClick={() => actions.update(state.selectedComment!)}>댓글 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
