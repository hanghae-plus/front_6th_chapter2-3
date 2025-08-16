import { Button, Textarea } from "@/shared/ui"
import { CommentInput } from "@/entities/Comment"
import { useMutationCommentAdd } from "@/features/comment/api/useMutationCommentAdd"
import { useCommentDialog } from "@/features/comment/model/useCommentDialog.ts"
import { useState } from "react"

export function CommentFormAdd() {
  const { showAddCommentDialog } = useCommentDialog()
  const postId = showAddCommentDialog?.postId ?? null
  const [newComment, setNewComment] = useState<CommentInput>({ body: "", postId, userId: 1 })

  const { mutate: addComment } = useMutationCommentAdd()
  const { setShowAddCommentDialog } = useCommentDialog()

  function handleBodyChange(body: string) {
    setNewComment({ ...newComment, body })
  }

  async function handleCommentAdd() {
    addComment(newComment)
    setShowAddCommentDialog(null)
    setNewComment({ body: "", postId: null, userId: 1 })
  }

  return (
    <div className="space-y-4">
      <Textarea placeholder="댓글 내용" value={newComment.body} onChange={(e) => handleBodyChange(e.target.value)} />

      <Button onClick={handleCommentAdd}>댓글 추가</Button>
    </div>
  )
}
