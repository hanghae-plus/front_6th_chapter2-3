import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, Button } from "@shared/ui"
import { highlightText } from "@shared/lib"
import type { Post } from "@entities/post"
import type { Comment } from "@entities/comment"

interface PostDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post: Post | null
  comments?: Comment[]
  searchQuery: string
  onOpenAddComment: (postId: number) => void
  onLikeComment: (commentId: number, postId: number) => void
  onEditComment: (comment: Comment) => void
  onDeleteComment: (commentId: number, postId: number) => void
}


export const PostDetailDialog: React.FC<PostDetailDialogProps> = ({
  open,
  onOpenChange,
  post,
  comments,
  searchQuery,
  onOpenAddComment,
  onLikeComment,
  onEditComment,
  onDeleteComment,
}) => {
  const postId = post?.id

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
                {comments?.map((comment) => (
                  <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
                    <div className="flex items-center space-x-2 overflow-hidden">
                      <span className="font-medium truncate">{comment.user.username}:</span>
                      <span className="truncate">{highlightText(comment.body, searchQuery)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => onLikeComment(comment.id, postId)}>
                        좋아요 <span className="ml-1 text-xs">{comment.likes}</span>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onEditComment(comment)}>
                        수정
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onDeleteComment(comment.id, postId)}>
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
