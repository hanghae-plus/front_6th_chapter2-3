import { Edit2, ThumbsUp, Trash2 } from "lucide-react"
import { Button } from "@shared/ui"
import { CommentItem as CommentType } from "../model"
import type { ReactElement } from "react"

type CommentWithHighlight = CommentType & {
  highlightedBody?: ReactElement | null
}

interface CommentItemProps {
  comment: CommentWithHighlight
  onEdit: (comment: CommentType) => void
  onDelete: (id: number) => void
  onLike: (id: number) => void
}

export const CommentItem = ({ comment, onEdit, onDelete, onLike }: CommentItemProps) => {
  return (
    <div className="flex items-center justify-between text-sm border-b pb-1">
      <div className="flex items-center space-x-2 overflow-hidden">
        <span className="font-medium truncate">{comment.user.username}:</span>
        <span className="truncate">{comment.highlightedBody || comment.body}</span>
      </div>
      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="sm" onClick={() => onLike(comment.id)}>
          <ThumbsUp className="w-3 h-3" />
          <span className="ml-1 text-xs">{comment.likes}</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onEdit(comment)}>
          <Edit2 className="w-3 h-3" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(comment.id)}>
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  )
}
