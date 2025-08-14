import { Button, Dialog, Textarea } from "../../../shared/ui"
import { useCommentStore } from "../model/store"
import { Comment } from "../../../entities"
import { useComment } from "../model/hook"

export const CommentEditDialog = () => {
  const { selectedComment, setSelectedComment, showEditCommentDialog, setShowEditCommentDialog } = useCommentStore()
  const { updateComment } = useComment()

  return (
    <Dialog open={showEditCommentDialog} handleChange={setShowEditCommentDialog} title="댓글 수정">
      <div className="space-y-4">
        <Textarea
          placeholder="댓글 내용"
          value={selectedComment?.body || ""}
          onChange={(e) => setSelectedComment({ ...(selectedComment as Comment), body: e.target.value })}
        />
        <Button onClick={updateComment}>댓글 업데이트</Button>
      </div>
    </Dialog>
  )
}
