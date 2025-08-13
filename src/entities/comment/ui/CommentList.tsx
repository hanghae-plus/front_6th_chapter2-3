import { Button } from "../../../shared/ui/Button"
import { Plus } from "lucide-react"
import { FC } from "react"
import CommentItem from "./CommentItem"
import { Comment } from "../model/types"

interface CommentListProps {
  postId: number
  searchQuery?: string
  comments: Comment[]
  onAddComment: (postId: number) => void
  onEditComment: (comment: Comment) => void
  onDeleteComment: (id: number) => void
  onLikeComment: (id: number) => void
}

const CommentList: FC<CommentListProps> = ({ 
  postId, 
  searchQuery = "", 
  comments,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onLikeComment
}) => {
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button size="sm" onClick={() => onAddComment(postId)}>
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {comments?.map((comment) => (
          <CommentItem 
            key={comment.id} 
            comment={comment} 
            searchQuery={searchQuery}
            onEditComment={onEditComment}
            onDeleteComment={onDeleteComment}
            onLikeComment={onLikeComment}
          />
        ))}
      </div>
    </div>
  )
}

export default CommentList
