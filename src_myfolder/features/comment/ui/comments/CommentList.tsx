import { Button } from "../../../../shared/ui"
import { Plus, ThumbsUp, Edit2, Trash2 } from "lucide-react"

import { Comment } from "../../../entities/comment/model"
import { HighlightText } from "../../../../shared/ui/HighlightText"

interface CommentListProps {
  state: {
    comments: Comment[]
    searchMode: {
      param: string
    }
    postId: number
  }
  action: {
    add: (postId: number) => void
    update: (comment: Comment) => void
    delete: (comment: Comment) => void
    like: (comment: Comment) => void
  }
}
export default function CommentList({ state, action }: CommentListProps) {
  const { comments, searchMode, postId } = state
  const { add, update, delete: deleteComment, like } = action
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2 ">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button size="sm" onClick={() => add(postId)}>
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {comments?.map((comment) => (
          <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="font-medium truncate">{comment.user.username}:</span>
              <span className="truncate">
                <HighlightText text={comment.body} highlight={searchMode.param} />
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={() => like(comment)}>
                <ThumbsUp className="w-3 h-3" />
                <span className="ml-1 text-xs">{comment.likes}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  update(comment)
                }}
              >
                <Edit2 className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => deleteComment(comment)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
