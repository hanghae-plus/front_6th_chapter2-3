import { Button, Textarea } from "@/shared/ui"
import { useMutationCommentUpdate } from "@/features/comment/api/useMutationCommentUpdate"
import { useComment } from "@/features/comment/model/useComment.ts"
import { useCommentDialog } from "@/features/comment/model/useCommentDialog.ts"

export function CommentFormEdit() {
  const { selectedComment, setSelectedComment } = useComment()
  const { setShowEditCommentDialog } = useCommentDialog()
  const { mutate: updateComment } = useMutationCommentUpdate()

  function handleBodyChange(body: string): void {
    setSelectedComment((selectedComment) => (!selectedComment ? null : { ...selectedComment, body }))
  }

  async function handleCommentUpdate() {
    if (!selectedComment) {
      return
    }

    updateComment(selectedComment)
    setShowEditCommentDialog(false)
  }

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="댓글 내용"
        value={selectedComment?.body || ""}
        onChange={(e) => handleBodyChange(e.target.value)}
      />

      <Button onClick={handleCommentUpdate}>댓글 업데이트</Button>
    </div>
  )
}
