/* eslint-disable @typescript-eslint/no-explicit-any */

import { CommentList } from "@/entities/comment/ui"
import { PostHighlightText } from "@/entities/post/ui"
import { Dialog } from "@/shared/ui"

type PostDetailDialogProps = {
  showPostDetailDialog: any
  setShowPostDetailDialog: any
  selectedPost: any
  searchQuery: any
  comments: any
  onAddComment: (postId: any) => void
  onEditComment: (comment: any) => void
  onDeleteComment: (commentId: any, postId: any) => void
  onLikeComment: (commentId: any, postId: any) => void
}

export function PostDetailDialog({
  searchQuery,
  selectedPost,
  setShowPostDetailDialog,
  showPostDetailDialog,
  comments,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onLikeComment,
}: PostDetailDialogProps) {
  return (
    <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
      <Dialog.Content className="max-w-3xl">
        <Dialog.Header>
          <Dialog.Title>
            <PostHighlightText text={selectedPost?.title || ""} highlight={searchQuery} />
          </Dialog.Title>
        </Dialog.Header>
        <div className="space-y-4">
          <p>
            <PostHighlightText text={selectedPost?.body || ""} highlight={searchQuery} />
          </p>
          <CommentList
            postId={selectedPost?.id}
            comments={comments}
            searchQuery={searchQuery}
            onAddComment={onAddComment}
            onEditComment={onEditComment}
            onDeleteComment={onDeleteComment}
            onLikeComment={onLikeComment}
          />
        </div>
      </Dialog.Content>
    </Dialog>
  )
}
