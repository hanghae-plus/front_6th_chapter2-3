import { CommentRequest } from "../../../entities/comment/model"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../../shared/ui"
import { Textarea } from "../../../../shared/ui"
import { Button } from "../../../../shared/ui"

interface AddCommentModalProps {
  state: {
    isOpen: boolean
    newComment: CommentRequest
  }
  actions: {
    onOpenChange: (open: boolean) => void
    change: (body: string) => void
    add: (comment: CommentRequest) => void
  }
}

export default function AddCommentModal({ state, actions }: AddCommentModalProps) {
  return (
    <Dialog open={state.isOpen} onOpenChange={actions.onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={state.newComment.body}
            onChange={(e) => actions.change(e.target.value)}
          />
          <Button onClick={() => actions.add(state.newComment)}>댓글 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
