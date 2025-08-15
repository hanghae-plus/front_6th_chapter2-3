import { useAtom } from "jotai"
import { showAddCommentDialogAtom, newCommentAtom } from "../../../store/postsAtoms"
import { useComments } from "../../../features/comment/model/useComments"
import { CommentDialog } from "../../../shared/ui/CommentDialog"

export const AddCommentDialog = () => {
  const [open, setOpen] = useAtom(showAddCommentDialogAtom)
  const [newComment, setNewComment] = useAtom(newCommentAtom)
  const { addComment } = useComments()

  const handleAddComment = async () => {
    try {
      await addComment(newComment)
      setOpen(false)
      setNewComment({ body: "", postId: null, userId: 1 })
    } catch (error) {
      console.error("댓글 추가 오류:", error)
    }
  }

  return (
    <CommentDialog
      open={open}
      onOpenChange={setOpen}
      title="새 댓글 추가"
      placeholder="댓글 내용"
      value={newComment.body}
      onChange={(body) => setNewComment({ ...newComment, body })}
      onSubmit={handleAddComment}
      submitText="댓글 추가"
    />
  )
}
