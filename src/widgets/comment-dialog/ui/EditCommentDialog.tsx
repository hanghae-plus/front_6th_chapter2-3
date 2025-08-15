import { useAtom } from "jotai"
import { showEditCommentDialogAtom, selectedCommentAtom } from "../../../store/postsAtoms"
import { useComments } from "../../../features/comment/model/useComments"
import { CommentDialog } from "../../../shared/ui/CommentDialog"

export const EditCommentDialog = () => {
  const [open, setOpen] = useAtom(showEditCommentDialogAtom)
  const [selectedComment, setSelectedComment] = useAtom(selectedCommentAtom)
  const { updateComment } = useComments()

  const handleUpdateComment = async () => {
    if (!selectedComment) return
    try {
      await updateComment(selectedComment.id, selectedComment.body)
      setOpen(false)
    } catch (error) {
      console.error("댓글 수정 오류:", error)
    }
  }

  return (
    <CommentDialog
      open={open}
      onOpenChange={setOpen}
      title="댓글 수정"
      placeholder="댓글 내용"
      value={selectedComment?.body || ""}
      onChange={(body) => selectedComment && setSelectedComment({ ...selectedComment, body })}
      onSubmit={handleUpdateComment}
      submitText="댓글 업데이트"
    />
  )
}
