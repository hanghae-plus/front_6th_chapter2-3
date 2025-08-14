import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, Button } from "@shared/ui"
import { highlightText } from "@shared/lib"
import type { Comment } from "@entities/comment"
import { useGetComments } from "@entities/comment"
import { usePostDialogStore } from "@/features/post-dialog"
import { useCommentDialogStore } from "@/features/comment-dialog"
import { usePostQueryParams } from "@shared/hooks/use-post-query-params"
import { CommentItem } from "./comment-item"

export const PostDetailDialog: React.FC = () => {
  const { param } = usePostQueryParams()
  const open = usePostDialogStore((s) => s.isPostDetailOpen)
  const post = usePostDialogStore((s) => s.selectedPost)
  const close = usePostDialogStore((s) => s.closePostDetail)
  const openAddComment = useCommentDialogStore((s) => s.openAddComment)
  const openEditComment = useCommentDialogStore((s) => s.openEditComment)
  const postId = post?.id

  const { data: commentsData } = useGetComments(postId ?? null)
  const comments = commentsData?.comments || []

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(post?.title || "", param.search || "")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{highlightText(post?.body || "", param.search || "")}</p>

          {postId && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold">댓글</h3>
                <Button size="sm" onClick={() => openAddComment(postId)}>
                  댓글 추가
                </Button>
              </div>
              <div className="space-y-1">
                {comments?.map((comment: Comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    postId={postId}
                    searchQuery={param.search || ""}
                    onOpenEditComment={openEditComment}
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
