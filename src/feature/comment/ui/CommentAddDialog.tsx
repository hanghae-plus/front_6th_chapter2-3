import { Button, Dialog, Textarea } from "../../../shared/ui"
import { NewComment } from "../type"

export const CommentAddDialog = ({
  showAddCommentDialog,
  setShowAddCommentDialog,
  newComment,
  setNewComment,
  addComment,
}: {
  showAddCommentDialog: boolean
  setShowAddCommentDialog: React.Dispatch<React.SetStateAction<boolean>>
  newComment: NewComment
  addComment: () => Promise<void>
  setNewComment: (value: React.SetStateAction<NewComment>) => void
}) => {
  return (
    <Dialog open={showAddCommentDialog} handleChange={setShowAddCommentDialog} title="새 댓글 추가">
      <div className="space-y-4">
        <Textarea
          placeholder="댓글 내용"
          value={newComment.body}
          onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
        />
        <Button onClick={addComment}>댓글 추가</Button>
      </div>
    </Dialog>
  )
}
