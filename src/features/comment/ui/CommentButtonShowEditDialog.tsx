import { Button } from "@/shared/ui"
import { type Comment } from "@/entities/Comment"
import { useComment } from "@/features/comment/model/useComment"
import { useCommentDialog } from "@/features/comment/model/useCommentDialog.ts"
import { Edit2 } from "lucide-react"

export function CommentButtonShowEditDialog({ comment }: { comment: Comment }) {
  const { setSelectedComment } = useComment()
  const { setShowEditCommentDialog } = useCommentDialog()

  function handleEditCommentDialogOpen() {
    setSelectedComment(comment)
    setShowEditCommentDialog(true)
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleEditCommentDialogOpen}>
      <Edit2 className="w-3 h-3" />
    </Button>
  )
}
