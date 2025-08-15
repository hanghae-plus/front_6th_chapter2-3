import type { Comment } from "@/entities/comment/model"
import { CommentList } from "@/entities/comment/ui"
import { PostHighlightText } from "@/entities/post/ui"
import { useDeleteCommentMutation } from "@/features/delete-comment/api"
import { useCommentDialogStore } from "@/features/get-comments/model"
import { usePostDialogStore } from "@/features/get-post/model"
import { usePostParamsStore } from "@/features/get-post/model"
import { useLikeCommentMutation } from "@/features/like-comment/api"
import { DialogType, useDialogStore } from "@/shared/lib"
import { Dialog } from "@/shared/ui"

export function PostDetailDialog() {
  const currentDialog = useDialogStore((state) => state.currentDialog)
  const { openDialog, closeDialog } = useDialogStore((state) => state.actions)
  const { selectedPost } = usePostDialogStore((state) => state)
  const { setSelectedComment, setAddCommentPostId } = useCommentDialogStore((state) => state.actions)
  const search = usePostParamsStore((state) => state.search)

  const deleteCommentMutation = useDeleteCommentMutation()
  const likeCommentMutation = useLikeCommentMutation()

  const isOpen = currentDialog === DialogType.POST_DETAIL

  const handleAddComment = (postId: number) => {
    setAddCommentPostId(postId)
    openDialog(DialogType.ADD_COMMENT)
  }

  const handleEditComment = (comment: Comment) => {
    setSelectedComment(comment)
    openDialog(DialogType.EDIT_COMMENT)
  }

  const handleDeleteComment = (commentId: number) => {
    deleteCommentMutation.mutate({ commentId })
  }

  const handleLikeComment = (commentId: number) => {
    likeCommentMutation.mutate({ commentId, likes: 1 })
  }

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
          <Dialog.Description></Dialog.Description>
        </Dialog.Header>
        <div className="space-y-4">
          <p>
            <PostHighlightText text={selectedPost.body} highlight={search} />
          </p>
          <CommentList
            postId={selectedPost.id}
            searchQuery={search}
            onAddComment={handleAddComment}
            onEditComment={handleEditComment}
            onDeleteComment={handleDeleteComment}
            onLikeComment={handleLikeComment}
          />
        </div>
      </Dialog.Content>
    </Dialog>
  )
}
