import { Edit2, Plus, ThumbsUp, Trash2 } from "lucide-react"
import { useSearchQueryStore, useSelectedPostStore } from "../../post"
import { Button, HighlightText } from "../../../shared"
import { useCommentStore, useComment } from "../model"

export const Comments = () => {
  const { searchQuery } = useSearchQueryStore()
  const { selectedPost } = useSelectedPostStore()
  const postId = selectedPost.id
  const { setShowEditCommentDialog, setSelectedComment } = useCommentStore()
  const {
    comments, // 더 이상 comments[postId]가 아닌 현재 게시물의 댓글 배열
    handleAddComment,
    likeComment,
    deleteComment,
  } = useComment(selectedPost?.id)

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button size="sm" onClick={() => handleAddComment(postId)}>
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {(comments ?? []).map((comment) => (
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
