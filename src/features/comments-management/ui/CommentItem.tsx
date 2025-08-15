import { ThumbsUp, Edit2, Trash2 } from "lucide-react"
import { Button } from "../../../shared/ui"
import { type Comment as CommentItem } from "../../../entities/comments/api/types"
import HighlightText from "../../../shared/ui/HighlightText"

interface Props {
  comment: CommentItem
  postId: number

  searchQuery: string

  onClickLike: (id: number, postId: number) => void
  onClickEdit: (comment: CommentItem) => void
  onClickDelete: (id: number, postId: number) => void
}

const CommentItem = ({
  comment,
  postId,
  searchQuery,

  onClickLike,
  onClickEdit,
  onClickDelete,
}: Props) => {
  return (
    <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
      <div className="flex items-center space-x-2 overflow-hidden">
        <span className="font-medium truncate">{comment.user.username}:</span>
        <span className="truncate">
          <HighlightText text={comment?.body} highlight={searchQuery} />
        </span>
      </div>
      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="sm" onClick={() => onClickLike(comment.id, postId)}>
          <ThumbsUp className="w-3 h-3" />
          <span className="ml-1 text-xs">{comment.likes}</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onClickEdit(comment)}>
          <Edit2 className="w-3 h-3" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onClickDelete(comment.id, postId)}>
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  )
}

export default CommentItem
