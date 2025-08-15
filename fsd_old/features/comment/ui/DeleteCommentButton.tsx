import { Comment } from "@entities/comment"
import { useDeleteComment } from "@features/comment"
import { Button } from "@shared/ui/button"
import { Trash2 } from "lucide-react"

interface DeleteCommentButtonProps {
  comment: Comment
}

export const DeleteCommentButton = ({ comment }: DeleteCommentButtonProps) => {
  const { mutate: deleteComment } = useDeleteComment()

  return (
    <Button variant="ghost" size="sm" onClick={() => deleteComment({ id: comment.id, postId: comment.postId })}>
      <Trash2 className="w-3 h-3" />
    </Button>
  )
}
