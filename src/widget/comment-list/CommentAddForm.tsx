import { Button, Textarea } from "../../shared/ui"
import { Comment } from "../../entities/comment/model/types"

interface CommentAddFormProps {
  comment: { body: string; postId: number | null; userId: number }
  onCommentChange: (comment: { body: string; postId: number | null; userId: number }) => void
  onSubmit: () => void
  isLoading: boolean
}

export const CommentAddForm = ({ comment, onCommentChange, onSubmit, isLoading }: CommentAddFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (comment.body.trim() && comment.postId) {
      onSubmit()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="댓글 내용"
        value={comment.body}
        onChange={(e) => onCommentChange({ ...comment, body: e.target.value })}
        required
      />
      <Button type="submit" disabled={isLoading || !comment.body.trim() || !comment.postId}>
        {isLoading ? "추가 중..." : "댓글 추가"}
      </Button>
    </form>
  )
}
