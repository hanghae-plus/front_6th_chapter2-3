import { ThumbsUp, Trash2 } from "lucide-react"

import { Comment } from "@/entities/comment"
import { AddCommentButton } from "@/feature/add-comment"
import { useDeleteCommentMutation } from "@/feature/delete-comment"
import { useGetComments } from "@/feature/get-comments"
import { usePostsQuery } from "@/feature/post-query"
import { useUpdateCommentLikeMutation } from "@/feature/update-comment-like"
import { UpdateCommentButton } from "@/feature/update-comment/ui/UpdateCommentButton"
import { highlightText } from "@/shared"
import { Button } from "@/shared/ui"

interface PostCommentsProps {
  postId: number
}

export const PostComments = ({ postId }: PostCommentsProps) => {
  const { data: comments } = useGetComments(postId)
  const { current } = usePostsQuery()

  const commentLikes = useUpdateCommentLikeMutation()
  const { isError, isPending, mutate: deleteCommentMutate } = useDeleteCommentMutation()

  const handleLikeComment = (comment: Comment) => {
    commentLikes.mutate(comment)
  }

  const handleDeleteComment = (commentId: number) => {
    deleteCommentMutate(commentId)
  }

  if (isError) {
    return <div className="text-red-500">댓글 삭제에 실패했습니다.</div>
  }

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <AddCommentButton postId={postId} />
      </div>

      <div className="space-y-1">
        {comments?.comments?.map((comment) => (
          <div className="flex items-center justify-between text-sm border-b pb-1" key={comment.id}>
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="font-medium truncate">{comment.user.username}:</span>
              <span className="truncate">{highlightText(comment.body, current.search)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                aria-label="댓글 좋아요"
                disabled={isPending}
                onClick={() => handleLikeComment(comment)}
                size="sm"
                variant="ghost"
              >
                <ThumbsUp className="w-3 h-3" />
                <span className="ml-1 text-xs">{comment.likes}</span>
              </Button>
              <UpdateCommentButton comment={comment} />
              <Button
                aria-label="댓글 삭제"
                disabled={isPending}
                onClick={() => handleDeleteComment(comment.id)}
                size="sm"
                variant="ghost"
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
