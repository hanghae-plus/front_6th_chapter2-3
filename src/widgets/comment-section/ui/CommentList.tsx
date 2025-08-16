import { Comment } from "@/entities/comment/model"
import { CommentItem } from "@/entities/comment/ui"

interface CommentListProps {
  comments: Comment[]
  onLike: (id: number) => void
  onEdit: (comment: Comment) => void
  onDelete: (id: number) => void
}

export const CommentList = ({ comments, onLike, onEdit, onDelete }: CommentListProps) => {
  if (!comments || comments.length === 0) {
    return <div className="text-center py-4 text-gray-500">댓글이 없습니다.</div>
  }

  return (
    <div className="space-y-1">
      {comments.map((comment: Comment) => (
        <CommentItem key={comment.id} comment={comment} onLike={onLike} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}
