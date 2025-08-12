import { Button, Dialog, Textarea } from "../../../shared/ui"
import { Comment } from "../../../entities"

export const CommentEditDialog = ({
  showEditCommentDialog,
  setShowEditCommentDialog,
  selectedComment,
  setSelectedComment,
  updateComment,
}: {
  showEditCommentDialog: boolean
  setShowEditCommentDialog: React.Dispatch<React.SetStateAction<boolean>>
  selectedComment: Comment
  setSelectedComment: React.Dispatch<React.SetStateAction<Comment | null>>
  updateComment: () => Promise<void>
}) => {
  return (
    <Dialog open={showEditCommentDialog} handleChange={setShowEditCommentDialog} title="댓글 수정">
      <div className="space-y-4">
        <Textarea
          placeholder="댓글 내용"
          value={selectedComment?.body || ""}
          onChange={(e) => setSelectedComment({ ...selectedComment, body: e.target.value })}
        />
        <Button onClick={updateComment}>댓글 업데이트</Button>
      </div>
    </Dialog>
  )
}
