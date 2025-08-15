import { useAtom } from "jotai"
import { Edit2, ThumbsUp, Trash2 } from "lucide-react"
import { Button } from "../../../shared/ui"
import { CommentItemProps } from "../model/types"
import { commentsAtom, selectedCommentAtom, showEditCommentDialogAtom } from "../../../app/store"

// 하이라이트 함수
const highlightText = (text: string, highlight: string) => {
  if (!text) return null
  if (!highlight.trim()) {
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

export const CommentItem = ({ comment, searchQuery }: CommentItemProps) => {
  const [, setComments] = useAtom(commentsAtom)
  const [, setSelectedComment] = useAtom(selectedCommentAtom)
  const [, setShowEditCommentDialog] = useAtom(showEditCommentDialogAtom)

  const handleEdit = () => {
    setSelectedComment(comment)
    setShowEditCommentDialog(true)
  }

  const handleDelete = async () => {
    try {
      await fetch(`/api/comments/${comment.id}`, {
        method: "DELETE",
      })
      setComments((prev) => ({
        ...prev,
        [comment.postId]: prev[comment.postId].filter((c) => c.id !== comment.id),
      }))
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
    }
  }

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/comments/${comment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes: comment.likes + 1 }),
      })
      const data = await response.json()
      setComments((prev) => ({
        ...prev,
        [comment.postId]: prev[comment.postId].map((c) => (c.id === data.id ? { ...data, likes: c.likes + 1 } : c)),
      }))
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
    }
  }

  return (
    <div className="flex items-center justify-between text-sm border-b pb-1">
      <div className="flex items-center space-x-2 overflow-hidden">
        <span className="font-medium truncate">{comment.user?.username || 'Unknown'}:</span>
        <span className="truncate">{highlightText(comment.body, searchQuery)}</span>
      </div>
      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="sm" onClick={handleLike}>
          <ThumbsUp className="w-3 h-3" />
          <span className="ml-1 text-xs">{comment.likes}</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={handleEdit}>
          <Edit2 className="w-3 h-3" />
        </Button>
        <Button variant="ghost" size="sm" onClick={handleDelete}>
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  )
}
