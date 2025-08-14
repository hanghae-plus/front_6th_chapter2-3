/* eslint-disable @typescript-eslint/no-explicit-any */

import { DialogType, useDialogStore } from "@/shared/lib"
import { Button, Dialog, Textarea } from "@/shared/ui"

type CommentAddDialogProps = {
  addComment: any
  newComment: any
  setNewComment: any
}

export function CommentAddDialog({ addComment, newComment, setNewComment }: CommentAddDialogProps) {
  const currentDialog = useDialogStore((state) => state.currentDialog)
  const { closeDialog } = useDialogStore((state) => state.actions)
  const isOpen = currentDialog === DialogType.ADD_COMMENT

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>새 댓글 추가</Dialog.Title>
        </Dialog.Header>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={newComment?.body || ""}
            onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
          />
          <Button onClick={addComment}>댓글 추가</Button>
        </div>
      </Dialog.Content>
    </Dialog>
  )
}
