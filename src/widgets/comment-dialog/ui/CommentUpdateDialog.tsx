import { type ChangeEvent, useState } from "react"

import { useCommentDialogStore } from "@/features/get-comments/model"
import { DialogType, useDialogStore } from "@/shared/lib"
import { Button, Dialog, Textarea } from "@/shared/ui"

export function CommentUpdateDialog() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentDialog = useDialogStore((state) => state.currentDialog)
  const { openDialog, closeDialog } = useDialogStore((state) => state.actions)
  const { selectedComment } = useCommentDialogStore((state) => state)
  const { setSelectedComment } = useCommentDialogStore((state) => state.actions)

  const isOpen = currentDialog === DialogType.EDIT_COMMENT

  const handleBodyChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (!selectedComment) return
    setSelectedComment({ ...selectedComment, body: event.target.value })
  }

  const handleUpdateComment = async () => {
    if (!selectedComment || !selectedComment.body.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/comments/${selectedComment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: selectedComment.body }),
      })

      if (response.ok) {
        openDialog(DialogType.POST_DETAIL)
      }
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!selectedComment) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>댓글 수정</Dialog.Title>
        </Dialog.Header>
        <div className="space-y-4">
          <Textarea placeholder="댓글 내용" value={selectedComment.body} onChange={handleBodyChange} />
          <Button onClick={handleUpdateComment} disabled={!selectedComment.body.trim() || isSubmitting}>
            {isSubmitting ? "업데이트 중..." : "댓글 업데이트"}
          </Button>
        </div>
      </Dialog.Content>
    </Dialog>
  )
}
