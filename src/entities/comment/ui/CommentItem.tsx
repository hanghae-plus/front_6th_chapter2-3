import { Edit2, ThumbsUp, Trash2 } from "lucide-react"
import { Button } from "@/shared/ui"
import { Comment } from "../model"

interface CommentItemProps {
  comment: Comment
  onLike: (id: number) => void
  onEdit: (comment: Comment) => void
  onDelete: (id: number) => void
  searchQuery?: string
}

export const CommentItem = ({ comment, onLike, onEdit, onDelete, searchQuery }: CommentItemProps) => {
  // 검색어 하이라이트 함수 (BasicPage.tsx와 동일한 스타일)
  const highlightText = (text: string, highlight: string) => {
    if (!text) return null
    if (!highlight?.trim()) {
      return <span>{text}</span>
    }
    const regex = new RegExp(`(${highlight})`, "gi")
    const parts = text.split(regex)
    return (
      <span>
        {parts.map((part, i) => (regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>))}
      </span>
    )
  }

  return (
    <div className="flex items-center justify-between text-sm border-b pb-1">
      <div className="flex items-center space-x-2 overflow-hidden">
        <span className="font-medium truncate">{comment.user.username}:</span>
        <span className="truncate">{highlightText(comment.body, searchQuery || "")}</span>
      </div>

      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="sm" onClick={() => onLike(comment.id)}>
          <ThumbsUp className="w-3 h-3" />
          <span className="ml-1 text-xs">{comment.reactions.likes}</span>
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
