import { useAtom } from "jotai"
import { Plus } from "lucide-react"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/ui"
import { PostDetailModalProps } from "../model/types"
import { CommentsList } from "./CommentsList"
import { commentsAtom, newCommentAtom, showAddCommentDialogAtom } from "../../../app/store"

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

export const PostDetailModal = ({ post, isOpen, onClose, searchQuery }: PostDetailModalProps) => {
  const [comments] = useAtom(commentsAtom)
  const [, setNewComment] = useAtom(newCommentAtom)
  const [, setShowAddCommentDialog] = useAtom(showAddCommentDialogAtom)

  if (!post) return null

  const handleAddComment = () => {
    setNewComment((prev) => ({ ...prev, postId: post.id }))
    setShowAddCommentDialog(true)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(post.title, searchQuery)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{highlightText(post.body, searchQuery)}</p>
          
          {/* 댓글 섹션 */}
          <div className="mt-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold">댓글</h3>
              <Button size="sm" onClick={handleAddComment}>
                <Plus className="w-3 h-3 mr-1" />
                댓글 추가
              </Button>
            </div>
            <CommentsList
              comments={comments[post.id] || []}
              searchQuery={searchQuery}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
