import { useState } from "react"
import { Edit2, Plus, ThumbsUp, Trash2, X } from "lucide-react"
import { Button } from "../../shared/ui"
import { useGetComments } from "../../features/comment/get-comments/hooks"
import { useDeleteCommentFeature } from "../../features/comment/del-comments/hooks"
import { useLikeCommentFeature } from "../../features/comment/like-comments/hooks"
import { CommentInputForm } from "./CommentInputForm"
import { Comment } from "../../entities/comment/model/types"

interface CommentListProps {
  postId: number
  userId?: number
  onEditComment?: (comment: Comment) => void
}

export const CommentList = ({ postId, userId = 1, onEditComment }: CommentListProps) => {
  const { comments } = useGetComments(postId)
  const { deleteComment, isLoading: isDeleting } = useDeleteCommentFeature()
  const { likeComment, isLoading: isLiking } = useLikeCommentFeature()

  const [showAddForm, setShowAddForm] = useState(false)

  const handleDeleteComment = async (id: number) => {
    const result = await deleteComment(id)
    if (result.success) {
      // 삭제 성공 시 별도 처리 불필요 (React Query가 자동으로 처리)
    }
  }

  const handleLikeComment = async (id: number) => {
    const result = await likeComment(id)
    if (result.success) {
      // 좋아요 성공 시 별도 처리 불필요 (React Query가 자동으로 처리)
    }
  }

  const handleAddSuccess = () => {
    setShowAddForm(false)
  }

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">댓글 ({comments.length})</h3>
        <Button size="sm" onClick={() => setShowAddForm(!showAddForm)} variant={showAddForm ? "outline" : "default"}>
          {showAddForm ? (
            <>
              <X className="w-4 h-4 mr-1" />
              취소
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-1" />
              댓글 추가
            </>
          )}
        </Button>
      </div>

      {/* 댓글 추가 폼 */}
      {showAddForm && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <CommentInputForm
            postId={postId}
            userId={userId}
            onSuccess={handleAddSuccess}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {/* 댓글 목록 */}
      <div className="space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="border rounded-lg p-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-sm">{comment.user.username}</span>
                  <span className="text-xs text-gray-500">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLikeComment(comment.id)}
                    disabled={isLiking}
                    className="h-8 px-2"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span className="ml-1 text-xs">{comment.likes}</span>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onEditComment?.(comment)} className="h-8 px-2">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteComment(comment.id)}
                    disabled={isDeleting}
                    className="h-8 px-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-700">{comment.body}</p>
            </div>
          </div>
        ))}

        {comments.length === 0 && !showAddForm && (
          <div className="text-center text-gray-500 py-8">아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!</div>
        )}
      </div>
    </div>
  )
}
