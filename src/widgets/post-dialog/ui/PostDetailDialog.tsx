/* eslint-disable @typescript-eslint/no-explicit-any */

import { CommentList } from "@/entities/comment/ui"
import { PostHighlightText } from "@/entities/post/ui"
import { DialogType, useDialogStore } from "@/shared/lib"
import { Dialog } from "@/shared/ui"

type PostDetailDialogProps = {
  searchQuery: any
  selectedPost: any
  comments: any
  onAddComment: (postId: any) => void
  onEditComment: (comment: any) => void
  onDeleteComment: (commentId: any, postId: any) => void
  onLikeComment: (commentId: any, postId: any) => void
}

export function PostDetailDialog({
  searchQuery,
  selectedPost,
  comments,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onLikeComment,
}: PostDetailDialogProps) {
  const { currentDialog, closeDialog } = useDialogStore()
  const isOpen = currentDialog === DialogType.POST_DETAIL

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
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
