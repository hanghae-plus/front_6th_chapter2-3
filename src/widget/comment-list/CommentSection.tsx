import { memo } from "react"
import { Plus, Edit2, ThumbsUp, Trash2 } from "lucide-react"
import { Button } from "../../shared/ui"
import { Comment } from "../../entities/comment/model/types"
import { useGetComments } from "../../features/comment/get-comments/hooks"
import { useDeleteCommentFeature } from "../../features/comment/del-comments/hooks"
import { useLikeCommentFeature } from "../../features/comment/like-comments/hooks"
import { useQueryClient } from "@tanstack/react-query"

interface CommentSectionProps {
  postId: number
  onAddComment: () => void
  onEditComment: (comment: Comment) => void
}

export const CommentSection = memo(({ postId, onAddComment, onEditComment }: CommentSectionProps) => {
  const { comments } = useGetComments(postId)
  const { deleteComment, isLoading: isDeleting } = useDeleteCommentFeature()
  const { likeComment, isLoading: isLiking } = useLikeCommentFeature()
  const queryClient = useQueryClient()

  const handleDeleteComment = async (id: number) => {
    const result = await deleteComment(id)
    if (result.success) {
      queryClient.setQueryData(["comments", postId], (oldData: { comments: Comment[] } | undefined) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          comments: oldData.comments.filter((comment: Comment) => comment.id !== id),
        }
      })
    }
  }

  const handleLikeComment = async (id: number) => {
    const result = await likeComment(id)
    if (result.success) {
      queryClient.setQueryData(["comments", postId], (oldData: { comments: Comment[] } | undefined) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          comments: oldData.comments.map((comment: Comment) =>
            comment.id === id ? { ...comment, likes: comment.likes + 1 } : comment,
          ),
        }
      })
    }
  }

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button size="sm" onClick={onAddComment}>
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="font-medium truncate">{comment.user.username}:</span>
              <span className="truncate">{comment.body}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={() => handleLikeComment(comment.id)} disabled={isLiking}>
                <ThumbsUp className="w-3 h-3" />
                <span className="ml-1 text-xs">{comment.likes}</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onEditComment(comment)}>
                <Edit2 className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDeleteComment(comment.id)} disabled={isDeleting}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})
