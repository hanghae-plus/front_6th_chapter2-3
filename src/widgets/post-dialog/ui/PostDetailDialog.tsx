import type { Comment } from "@/entities/comment/model"
import { CommentList } from "@/entities/comment/ui"
import type { Post } from "@/entities/post/model"
import { PostHighlightText } from "@/entities/post/ui"
import { usePostParamsStore } from "@/features/get-post/model"
import { DialogType, useDialogStore } from "@/shared/lib"
import { Dialog } from "@/shared/ui"

type PostDetailDialogProps = {
  selectedPost: Post
  onAddComment: (postId: number) => void
  onEditComment: (comment: Comment) => void
  onDeleteComment: (commentId: number, postId: number) => void
  onLikeComment: (commentId: number, postId: number) => void
}

export function PostDetailDialog({
  selectedPost,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onLikeComment,
}: PostDetailDialogProps) {
  const search = usePostParamsStore((state) => state.search)

  const currentDialog = useDialogStore((state) => state.currentDialog)
  const { closeDialog } = useDialogStore((state) => state.actions)
  const isOpen = currentDialog === DialogType.POST_DETAIL

  // TODO: selectedPost 분기 임시처리 나중에 삭제 필요!
  if (!selectedPost) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <Dialog.Content className="max-w-3xl">
        <Dialog.Header>
          <Dialog.Title>
            <PostHighlightText text={selectedPost.title} highlight={search} />
          </Dialog.Title>
        </Dialog.Header>
        <div className="space-y-4">
          <p>
            <PostHighlightText text={selectedPost.body} highlight={search} />
          </p>
          <CommentList
            postId={selectedPost.id}
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
