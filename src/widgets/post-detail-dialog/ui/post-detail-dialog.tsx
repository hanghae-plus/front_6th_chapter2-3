import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, Button } from "@shared/ui"
import { highlightText } from "@shared/lib"
import type { Post } from "@entities/post"
import type { Comment } from "@entities/comment"
import { useGetComments } from "@entities/comment"
import { CommentItem } from "./comment-item"

interface PostDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post: Post | null
  searchQuery: string
  onOpenAddComment: (postId: number) => void
  onOpenEditComment: (comment: Comment) => void
}

export const PostDetailDialog: React.FC<PostDetailDialogProps> = ({
  open,
  onOpenChange,
  post,
  searchQuery,
  onOpenAddComment,
  onOpenEditComment,
}) => {
  const postId = post?.id

  const { data: commentsData } = useGetComments(postId ?? 0)
  const comments = commentsData?.comments || []

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
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    postId={postId}
                    searchQuery={searchQuery}
                    onOpenEditComment={onOpenEditComment}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
