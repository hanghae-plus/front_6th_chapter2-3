import { Button } from "@/shared/ui"
import { PostId } from "@/entities/Post"
import { useCommentDialog } from "@/features/comment/model/useCommentDialog.ts"
import { Plus } from "lucide-react"

export function CommentButtonAdd({ postId }: { postId: PostId }) {
  const { setShowAddCommentDialog } = useCommentDialog()

  function handleAddCommentDialogOpen() {
    setShowAddCommentDialog({ postId })
  }

  return (
    <Button size="sm" onClick={handleAddCommentDialogOpen}>
      <Plus className="w-3 h-3 mr-1" />
      댓글 추가
    </Button>
  )
}
