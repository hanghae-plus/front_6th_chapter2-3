import { Plus } from "lucide-react"

import type { Comment } from "@/entities/comment/model"
import { CommentItem } from "@/entities/comment/ui/CommentItem"
import { useCommentsQuery } from "@/features/get-comments/api"
import { Button } from "@/shared/ui/Button"

type CommentListProps = {
  postId: number
  searchQuery: string
  onAddComment: (postId: number) => void
  onEditComment: (comment: Comment) => void
  onDeleteComment: (commentId: number, postId: number) => void
  onLikeComment: (commentId: number, postId: number) => void
}

export function CommentList({
  postId,
  searchQuery,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onLikeComment,
}: CommentListProps) {
  const { data: commentsData, isLoading } = useCommentsQuery({ postId })
  const comments = commentsData?.comments || []

  const handleAddComment = () => {
    onAddComment(postId)
  }

  return (
    <div className="mt-2">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button size="sm" onClick={handleAddComment}>
          <Plus className="mr-1 h-3 w-3" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {isLoading ? (
          <div className="text-sm text-gray-500">댓글 로딩 중...</div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              searchQuery={searchQuery}
              onEditComment={onEditComment}
              onDeleteComment={onDeleteComment}
              onLikeComment={onLikeComment}
            />
          ))
        )}
      </div>
    </div>
  )
}
