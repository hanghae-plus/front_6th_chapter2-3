import { Edit2, Plus, ThumbsUp, Trash2 } from 'lucide-react'
import { Button } from '@shared/ui/Button'
import { useCommentsSection } from '../model/useCommentManagement'
import { renderHighlighted } from '../lib/textHighlight'

export const CommentsSection = ({ postId }: { postId: number }) => {
  const {
    comments,
    isCommentsLoading,
    searchQuery,
    setSelectedCommentId,
    setShowAddCommentDialog,
    setShowEditCommentDialog,
    likeCommentMutation,
    deleteCommentMutation,
  } = useCommentsSection(postId)

  if (isCommentsLoading) {
    return <div>댓글 로딩 중...</div>
  }

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button
          size="sm"
          onClick={() => {
            setShowAddCommentDialog(true)
          }}
        >
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="font-medium truncate">{comment.user.username}:</span>
              <span className="truncate">
                {renderHighlighted(comment.body, searchQuery)?.map((part) => 
                  part.isHighlighted ? (
                    <mark key={part.key}>{part.text}</mark>
                  ) : (
                    <span key={part.key}>{part.text}</span>
                  )
                )}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  likeCommentMutation.mutate({
                    id: comment.id,
                    likes: comment.likes,
                    postId,
                  })
                }
              >
                <ThumbsUp className="w-3 h-3" />
                <span className="ml-1 text-xs">{comment.likes}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedCommentId(comment.id)
                  setShowEditCommentDialog(true)
                }}
              >
                <Edit2 className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteCommentMutation.mutate({ id: comment.id, postId })}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}