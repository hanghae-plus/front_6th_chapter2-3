import { useCommentDialogs } from "../../../../shared/store"
import { DialogHeader, Textarea, Button, Dialog, DialogContent, DialogTitle } from "../../../../shared/ui"
import { useSelectedComment } from "../../model"
import { useEditComment } from "../model/useEditComment"

export const EditCommentForm = () => {
  const { selectedComment, setSelectedComment } = useSelectedComment()
  const { updateComment } = useEditComment()
  const { showEditCommentDialog, setShowEditCommentDialog } = useCommentDialogs()

  if (!selectedComment) return

  return (
    <Dialog open={showEditCommentDialog} onOpenChange={setShowEditCommentDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={selectedComment.body || ""}
            onChange={(e) => setSelectedComment({ ...selectedComment, body: e.target.value })}
          />
          <Button onClick={updateComment}>댓글 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
