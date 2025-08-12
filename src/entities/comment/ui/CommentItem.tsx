import { Button } from "../../../shared/ui/Button"
import { Edit2, Trash2, ThumbsUp } from "lucide-react"
import { Comment } from "../model/types"
import { useCommentManagement } from "../../../features/commentManagement/model/useCommentManagement"
import { highlightText } from "../../../shared/utils/highlightText"

interface CommentItemProps {
  comment: Comment
  searchQuery?: string
}

const CommentItem: FC<CommentItemProps> = ({ comment, searchQuery = "" }) => {
  const { handleLikeComment, handleDeleteComment, openEditCommentDialog } = useCommentManagement()

  return (
    <div className="flex items-center justify-between text-sm border-b pb-1">
      <div className="flex items-center space-x-2 overflow-hidden">
        <span className="font-medium truncate">{comment.user.username}:</span>
        <span className="truncate">{highlightText(comment.body, searchQuery)}</span>
      </div>
      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="sm" onClick={() => handleLikeComment(comment.id, comment.postId)}>
          <ThumbsUp className="w-3 h-3" />
          <span className="ml-1 text-xs">{comment.likes}</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={() => openEditCommentDialog(comment)}>
          <Edit2 className="w-3 h-3" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => handleDeleteComment(comment.id, comment.postId)}>
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  )
}
export default CommentItem
