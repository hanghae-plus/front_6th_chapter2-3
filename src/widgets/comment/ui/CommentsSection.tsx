import { Edit2, Plus, ThumbsUp, Trash2 } from "lucide-react"
import { Button } from "../../../shared/ui/index"
import { Comment } from "../../../types"
import { highlightText } from "../../../lib/textHighlight"

interface CommentsSectionProps {
  postId: number
  comments: Comment[]
  searchQuery: string
  onAddComment: (postId: number) => void
  onEditComment: (comment: Comment) => void
  onDeleteComment: (id: number, postId: number) => void
  onLikeComment: (id: number) => void
  isLoading?: boolean
  error?: Error | null
}

export const CommentsSection = ({
  postId,
  comments,
  searchQuery,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onLikeComment,
  isLoading = false,
  error = null,
}: CommentsSectionProps) => {
  if (isLoading) {
    return (
      <div className="mt-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold">댓글</h3>
        </div>
        <div className="text-sm text-gray-500">댓글을 불러오는 중...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold">댓글</h3>
        </div>
        <div className="text-sm text-red-500">댓글을 불러오는데 실패했습니다: {error.message}</div>
      </div>
    )
  }

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
          <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="font-medium truncate">{comment.user.username}:</span>
              <span
                className="truncate"
                dangerouslySetInnerHTML={{
                  __html: highlightText(comment.body, searchQuery),
                }}
              />
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={() => onLikeComment(comment.id)}>
                <ThumbsUp className="w-3 h-3" />
                <span className="ml-1 text-xs">{comment.likes}</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onEditComment(comment)}>
                <Edit2 className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDeleteComment(comment.id, postId)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
