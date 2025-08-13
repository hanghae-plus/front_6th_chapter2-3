import { Button } from "../../../shared/ui/Button"
import { Edit2, Trash2, ThumbsUp } from "lucide-react"
import { Comment } from "../model/types"
import { highlightText } from "../../../shared/utils/highlightText"
import { FC } from "react"

interface CommentItemProps {
  comment: Comment
  searchQuery?: string
  onEditComment: (comment: Comment) => void
  onDeleteComment: (id: number) => void
  onLikeComment: (id: number) => void
}

const CommentItem: FC<CommentItemProps> = ({ 
  comment, 
  searchQuery = "",
  onEditComment,
  onDeleteComment,
  onLikeComment
}) => {
  return (
    <div className="flex items-center justify-between text-sm border-b pb-1">
      <div className="flex items-center space-x-2 overflow-hidden">
        <span className="font-medium truncate">{comment.user.username}:</span>
        <span className="truncate">{highlightText(comment.body, searchQuery)}</span>
      </div>
      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="sm" onClick={() => onLikeComment(comment.id)}>
          <ThumbsUp className="w-3 h-3" />
          <span className="ml-1 text-xs">{comment.likes}</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onEditComment(comment)}>
          <Edit2 className="w-3 h-3" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDeleteComment(comment.id)}>
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  )
}
export default CommentItem
