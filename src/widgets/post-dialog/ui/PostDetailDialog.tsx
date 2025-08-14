/* eslint-disable @typescript-eslint/no-explicit-any */

import { CommentList } from "@/entities/comment/ui"
import { PostHighlightText } from "@/entities/post/ui"
import { usePostParamsStore } from "@/features/get-post/model"
import { DialogType, useDialogStore } from "@/shared/lib"
import { Dialog } from "@/shared/ui"

type PostDetailDialogProps = {
  selectedPost: any
  comments: any
  onAddComment: (postId: any) => void
  onEditComment: (comment: any) => void
  onDeleteComment: (commentId: any, postId: any) => void
  onLikeComment: (commentId: any, postId: any) => void
}

export function PostDetailDialog({
  selectedPost,
  comments,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onLikeComment,
}: PostDetailDialogProps) {
  const search = usePostParamsStore((state) => state.search)

  const { currentDialog, closeDialog } = useDialogStore()
  const isOpen = currentDialog === DialogType.POST_DETAIL

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <Dialog.Content className="max-w-3xl">
        <Dialog.Header>
          <Dialog.Title>
            <PostHighlightText text={selectedPost?.title || ""} highlight={search} />
          </Dialog.Title>
        </Dialog.Header>
        <div className="space-y-4">
          <p>
            <PostHighlightText text={selectedPost?.body || ""} highlight={search} />
          </p>
          <CommentList
            postId={selectedPost?.id}
            comments={comments}
            searchQuery={search}
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
