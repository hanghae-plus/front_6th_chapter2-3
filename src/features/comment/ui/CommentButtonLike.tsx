import { Button } from "@/shared/ui"
import { type Comment } from "@/entities/Comment"
import { useMutationCommentLike } from "@/features/comment/api/useMutationCommentLike"
import { ThumbsUp } from "lucide-react"

export function CommentButtonLike({ comment }: { comment: Comment }) {
  const { mutate: likeComment } = useMutationCommentLike()

  async function handleCommentLike() {
    likeComment(comment)
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleCommentLike}>
      <ThumbsUp className="w-3 h-3" />
      <span className="ml-1 text-xs">{comment.likes}</span>
    </Button>
  )
}
