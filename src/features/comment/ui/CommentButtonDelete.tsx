import { Button } from "@/shared/ui"
import { type Comment } from "@/entities/Comment"
import { useMutationCommentDelete } from "@/features/comment/api/useMutationCommentDelete"
import { Trash2 } from "lucide-react"

export function CommentButtonDelete({ comment }: { comment: Comment }) {
  const { mutate: deleteComment } = useMutationCommentDelete()

  async function handleCommentDelete() {
    deleteComment(comment)
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleCommentDelete}>
      <Trash2 className="w-3 h-3" />
    </Button>
  )
}
