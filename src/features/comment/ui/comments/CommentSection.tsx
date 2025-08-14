import { Edit2, Plus, ThumbsUp, Trash2 } from "lucide-react"
import { Button } from "../../../../shared/ui"
import { HighlightText } from "../../../../shared/ui/HighlightText"
import { Comment } from "../../../../entities/comment/model"

interface CommentSectionProps {
  postId: number
  comments?: Comment[]
  searchQuery: string
  onAddComment: (postId: number) => void
  onLikeComment: (params: { id: number; postId: number }) => void
  onUpdateComment: (comment: Comment) => void
  onDeleteComment: (params: { id: number; postId: number }) => void
}

export const CommentSection = ({
  postId,
  comments,
  searchQuery,
  onAddComment,
  onLikeComment,
  onUpdateComment,
  onDeleteComment,
}: CommentSectionProps) => {
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
              <span className="font-medium truncate">{comment.user?.username || "unknown"}:</span>
              <span className="truncate">
                <HighlightText text={comment.body} highlight={searchQuery} />
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={() => onLikeComment({ id: comment.id, postId: postId })}>
                <ThumbsUp className="w-3 h-3" />
                <span className="ml-1 text-xs">{comment.likes}</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onUpdateComment(comment)}>
                <Edit2 className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDeleteComment({ id: comment.id, postId })}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
