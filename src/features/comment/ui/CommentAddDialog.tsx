import { useSelectedPostStore } from "../../post"
import { useCommentStore, useComment } from "../model"
import { Button, Dialog, Textarea } from "../../../shared"

export const CommentAddDialog = () => {
  const { selectedPost } = useSelectedPostStore()
  const { newComment, setNewComment, showAddCommentDialog, setShowAddCommentDialog } = useCommentStore()
  const { addComment } = useComment()

  return (
    <Dialog open={showAddCommentDialog} handleChange={setShowAddCommentDialog} title="새 댓글 추가">
      <div className="space-y-4">
        <Textarea
          placeholder="댓글 내용"
          value={newComment.body}
          onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
        />
        <Button onClick={() => addComment(selectedPost.id)}>댓글 추가</Button>
      </div>
    </Dialog>
  )
}
