import { AddCommentDialog } from "@/features/comment/create-comment/ui"
import { EditCommentDialog } from "@/shared/ui"
import { useDialogActions, useDialogStore } from "@/shared/model"
import { Comment, CreateComment } from "@/entities/comment/model"

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
      {/* 댓글 추가 대화상자 */}
      <AddCommentDialog
        open={isAddCommentOpen}
        onOpenChange={(open) => {
          if (!open) {
            hideDialog("ADD_COMMENT")
          }
        }}
        postId={postId}
        onSubmit={onAddComment}
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
        onUpdate={onUpdateComment}
      />
    </>
  )
}
