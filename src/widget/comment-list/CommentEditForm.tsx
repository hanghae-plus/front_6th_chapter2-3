import { Button, Textarea } from "../../shared/ui"
import { Comment } from "../../entities/comment/model/types"

interface CommentEditFormProps {
  comment: Comment | null
  onCommentChange: (comment: Comment | null) => void
  onSubmit: () => void
  isLoading?: boolean
}

export const CommentEditForm = ({ comment, onCommentChange, onSubmit, isLoading }: CommentEditFormProps) => {
  if (!comment) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (comment.body.trim()) {
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
        disabled={isLoading}
      />
      <Button type="submit" disabled={!comment.body.trim() || isLoading}>
        {isLoading ? "업데이트 중..." : "댓글 업데이트"}
      </Button>
    </form>
  )
}
