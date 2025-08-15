import type { ChangeEvent } from "react"

import { DialogType, useDialogStore } from "@/base/lib"
import { Button, Dialog, Textarea } from "@/base/ui"
import { useCommentDialogStore } from "@/features/get-comments/model"
import { useUpdateCommentMutation } from "@/features/update-comment/api"

export function CommentUpdateDialog() {
  const currentDialog = useDialogStore((state) => state.currentDialog)
  const { openDialog, closeDialog } = useDialogStore((state) => state.actions)
  const { selectedComment } = useCommentDialogStore((state) => state)
  const { setSelectedComment } = useCommentDialogStore((state) => state.actions)

  const updateCommentMutation = useUpdateCommentMutation()

  const isOpen = currentDialog === DialogType.EDIT_COMMENT

  const handleBodyChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (!selectedComment) return
    setSelectedComment({ ...selectedComment, body: event.target.value })
  }

  const handleUpdateComment = () => {
    if (!selectedComment || !selectedComment.body.trim()) return

    updateCommentMutation.mutate(
      { commentId: selectedComment.id, body: selectedComment.body },
      { onSuccess: () => openDialog(DialogType.POST_DETAIL) },
    )
  }

  if (!selectedComment) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>댓글 수정</Dialog.Title>
          <Dialog.Description></Dialog.Description>
        </Dialog.Header>
        <div className="space-y-4">
          <Textarea placeholder="댓글 내용" value={selectedComment.body} onChange={handleBodyChange} />
          <Button
            onClick={handleUpdateComment}
            disabled={!selectedComment.body.trim() || updateCommentMutation.isPending}
          >
            {updateCommentMutation.isPending ? "업데이트 중..." : "댓글 업데이트"}
          </Button>
        </div>
      </Dialog.Content>
    </Dialog>
  )
}
