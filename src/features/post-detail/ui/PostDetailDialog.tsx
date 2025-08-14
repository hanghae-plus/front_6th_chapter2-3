import { Plus, ThumbsUp, Edit2, Trash2 } from "lucide-react"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/ui"
import type { Post, Comment } from "../../../shared/lib"

interface PostDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post: Post | null
  comments: Comment[]
  searchQuery?: string
  onCommentAdd: () => void
  onCommentEdit: (comment: Comment) => void
  onCommentDelete: (commentId: number) => void
  onCommentLike: (commentId: number, currentLikes: number) => void
}

export const PostDetailDialog = ({
  open,
  onOpenChange,
  post,
  comments,
  searchQuery = "",
  onCommentAdd,
  onCommentEdit,
  onCommentDelete,
  onCommentLike,
}: PostDetailDialogProps) => {
  if (!post) return null

  // highlightText 함수
  const highlightText = (text: string) => {
    if (!text || !searchQuery.trim()) return <span>{text}</span>
    const regex = new RegExp(`(${searchQuery})`, "gi")
    const parts = text.split(regex)
    return (
      <span>
        {parts.map((part, i) => (regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>))}
      </span>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(post.title)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          <p className="whitespace-pre-wrap">{highlightText(post.body)}</p>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">댓글</h3>
              <Button size="sm" onClick={onCommentAdd}>
                <Plus className="w-3 h-3 mr-1" />
                댓글 추가
              </Button>
            </div>
            <div className="space-y-2">
              {comments?.map((comment) => (
                <div key={comment.id} className="flex items-start justify-between text-sm border-b pb-2">
                  <div className="flex items-center space-x-2 overflow-hidden">
                    <span className="font-medium">{comment.user.username}:</span>
                    <span className="truncate">{comment.body}</span>
                  </div>
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => onCommentLike(comment.id, comment.likes)}>
                      <ThumbsUp className="w-3 h-3" />
                      <span className="ml-1 text-xs">{comment.likes}</span>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onCommentEdit(comment)}>
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onCommentDelete(comment.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
