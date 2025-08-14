/* eslint-disable @typescript-eslint/no-explicit-any */

import { DialogType, useDialogStore } from "@/shared/lib"
import { Button, Dialog, Textarea } from "@/shared/ui"

type CommentUpdateDialogProps = {
  updateComment: any
  selectedComment: any
  setSelectedComment: any
}

export function CommentUpdateDialog({ updateComment, selectedComment, setSelectedComment }: CommentUpdateDialogProps) {
  const { currentDialog, closeDialog } = useDialogStore()
  const isOpen = currentDialog === DialogType.EDIT_COMMENT

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>댓글 수정</Dialog.Title>
        </Dialog.Header>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={selectedComment?.body || ""}
            onChange={(e) => setSelectedComment({ ...selectedComment, body: e.target.value })}
          />
          <Button onClick={updateComment}>댓글 업데이트</Button>
        </div>
      </Dialog.Content>
    </Dialog>
  )
}
