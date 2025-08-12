import { Plus } from "lucide-react"
import { Button } from "../../../shared/ui"
import { CommentItem as CommentType } from "../model"
import { CommentItem } from "./CommentItem"

interface CommentListProps {
  comments: CommentType[]
  searchQuery: string
  onAddComment: () => void
  onEditComment: (comment: CommentType) => void
  onDeleteComment: (id: number) => void
  onLikeComment: (id: number) => void
}

export const CommentList = ({
  comments,
  searchQuery,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onLikeComment,
}: CommentListProps) => {
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button size="sm" onClick={onAddComment}>
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            searchQuery={searchQuery}
            onEdit={onEditComment}
            onDelete={onDeleteComment}
            onLike={onLikeComment}
          />
        ))}
      </div>
    </div>
  )
}
