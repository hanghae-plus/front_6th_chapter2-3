import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, Button } from "@shared/ui"
import { highlightText } from "@shared/lib"
import type { Post } from "@entities/post"
import type { Comment } from "@entities/comment"
import { useGetComments, usePatchCommentLikes, useDeleteComment } from "@entities/comment"

interface PostDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post: Post | null
  searchQuery: string
  onOpenAddComment: (postId: number) => void
  onEditComment: (comment: Comment) => void
}

export const PostDetailDialog: React.FC<PostDetailDialogProps> = ({
  open,
  onOpenChange,
  post,
  searchQuery,
  onOpenAddComment,
  onEditComment,
}) => {
  const postId = post?.id

  const { data: commentsData } = useGetComments(postId ?? 0)
  const comments = commentsData?.comments || []

  const likeCommentMutation = usePatchCommentLikes()
  const deleteCommentMutation = useDeleteComment()

  const handleLikeComment = (commentId: number, postId: number) => {
    const currentLikes = comments.find((c: Comment) => c.id === commentId)?.likes || 0
    likeCommentMutation.mutate({ id: commentId, postId, currentLikes })
  }

  const handleDeleteComment = (commentId: number, postId: number) => {
    deleteCommentMutation.mutate({ id: commentId, postId })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(post?.title || "", searchQuery)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{highlightText(post?.body || "", searchQuery)}</p>

          {postId && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold">댓글</h3>
                <Button size="sm" onClick={() => onOpenAddComment(postId)}>
                  댓글 추가
                </Button>
              </div>
              <div className="space-y-1">
                {comments?.map((comment: Comment) => (
                  <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
                    <div className="flex items-center space-x-2 overflow-hidden">
                      <span className="font-medium truncate">{comment.user.username}:</span>
                      <span className="truncate">{highlightText(comment.body, searchQuery)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => handleLikeComment(comment.id, postId)}>
                        좋아요 <span className="ml-1 text-xs">{comment.likes}</span>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onEditComment(comment)}>
                        수정
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteComment(comment.id, postId)}>
                        삭제
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
