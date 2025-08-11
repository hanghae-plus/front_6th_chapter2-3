import { NewComment } from "../../shared/types"
import { Button, HighlightText } from "../../shared/ui"
import { Edit2, Plus, ThumbsUp, Trash2 } from "lucide-react"
import { Comment } from "../../entities"


export const Comments = ({
  postId,
  searchQuery,
  setNewComment,
  setShowAddCommentDialog,
  comments,
  setSelectedComment,
  setShowEditCommentDialog,
  likeComment,
  deleteComment,
}: {
  postId: number
  searchQuery: string
  setNewComment: React.Dispatch<React.SetStateAction<NewComment>>
  setShowAddCommentDialog: React.Dispatch<React.SetStateAction<boolean>>
  comments: {
    [key: number]: Comment[]
  }
  setSelectedComment: React.Dispatch<React.SetStateAction<Comment | null>>
  setShowEditCommentDialog: React.Dispatch<React.SetStateAction<boolean>>
  likeComment: (id: number, postId: number) => Promise<void>
  deleteComment: (id: number, postId: number) => Promise<void>
}) => {
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button
          size="sm"
          onClick={() => {
            setNewComment((prev) => ({ ...prev, postId }))
            setShowAddCommentDialog(true)
          }}
        >
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {comments[postId]?.map((comment) => (
          <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="font-medium truncate">{comment.user.username}:</span>
              <span className="truncate">{HighlightText(comment.body, searchQuery)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={() => likeComment(comment.id, postId)}>
                <ThumbsUp className="w-3 h-3" />
                <span className="ml-1 text-xs">{comment.likes}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedComment(comment)
                  setShowEditCommentDialog(true)
                }}
              >
                <Edit2 className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => deleteComment(comment.id, postId)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
