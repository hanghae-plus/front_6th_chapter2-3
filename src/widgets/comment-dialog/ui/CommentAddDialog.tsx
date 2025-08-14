import { type ChangeEvent, useState } from "react"

import { useCreateCommentMutation } from "@/features/create-comment/api"
import { DialogType, useDialogStore } from "@/shared/lib"
import { Button, Dialog, Textarea } from "@/shared/ui"

type CommentAddDialogProps = {
  postId: number | null
}

export function CommentAddDialog({ postId }: CommentAddDialogProps) {
  const [body, setBody] = useState("")

  const currentDialog = useDialogStore((state) => state.currentDialog)
  const { openDialog, closeDialog } = useDialogStore((state) => state.actions)

  const isOpen = currentDialog === DialogType.ADD_COMMENT
  const createCommentMutation = useCreateCommentMutation()

  const handleBodyChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setBody(event.target.value)
  }

  const handleAddComment = () => {
    if (!postId || !body.trim()) return

    createCommentMutation.mutate(
      { body: body.trim(), postId, userId: 1 },
      {
        onSuccess: () => {
          setBody("")
          openDialog(DialogType.POST_DETAIL)
        },
      },
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>새 댓글 추가</Dialog.Title>
        </Dialog.Header>
        <div className="space-y-4">
          <Textarea placeholder="댓글 내용" value={body} onChange={handleBodyChange} />
          <Button onClick={handleAddComment} disabled={!body.trim() || createCommentMutation.isPending}>
            {createCommentMutation.isPending ? "추가 중..." : "댓글 추가"}
          </Button>
        </div>
      </Dialog.Content>
    </Dialog>
  )
}
