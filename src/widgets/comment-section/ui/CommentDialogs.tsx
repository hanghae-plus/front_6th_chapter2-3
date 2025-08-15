import { AddCommentDialog } from "@/features/comment/create-comment/ui"
import { Comment, CreateComment } from "@/entities/comment/model"
import { EditCommentDialog } from "@/features/comment"
import { useDialogActions, useDialogStore } from "@/shared/model"

interface CommentDialogsProps {
  postId: number
  selectedComment: Comment | null
  onAddComment: (comment: CreateComment) => void
  onUpdateComment: (commentId: number, body: string) => void
  onCloseEdit: () => void
}

export const CommentDialogs = ({
  postId,
  selectedComment,
  onAddComment,
  onUpdateComment,
  onCloseEdit,
}: CommentDialogsProps) => {
  const isEditCommentOpen = useDialogStore((state) => state.dialogs.EDIT_COMMENT)
  const isAddCommentOpen = useDialogStore((state) => state.dialogs.ADD_COMMENT)
  const { hideDialog } = useDialogActions()

  return (
    <>
      <AddCommentDialog
        open={isAddCommentOpen}
        onOpenChange={(open) => {
          if (!open) {
            hideDialog("ADD_COMMENT")
          }
        }}
        postId={postId}
        onSubmit={async (comment) => {
          await onAddComment(comment)
        }}
      />

      <EditCommentDialog
        open={isEditCommentOpen}
        onOpenChange={(open) => {
          if (!open) {
            hideDialog("EDIT_COMMENT")
            onCloseEdit()
          }
        }}
        comment={selectedComment}
        onUpdate={async (commentId, body) => {
          await onUpdateComment(commentId, body)
        }}
      />
    </>
  )
}
