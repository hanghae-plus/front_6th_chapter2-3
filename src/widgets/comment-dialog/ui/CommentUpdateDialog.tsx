/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button, Dialog, Textarea } from "@/shared/ui"

type CommentUpdateDialogProps = {
  showEditCommentDialog: any
  setShowEditCommentDialog: any
  selectedComment: any
  setSelectedComment: any
  updateComment: any
}

export function CommentUpdateDialog({
  selectedComment,
  setSelectedComment,
  setShowEditCommentDialog,
  showEditCommentDialog,
  updateComment,
}: CommentUpdateDialogProps) {
  return (
    <Dialog open={showEditCommentDialog} onOpenChange={setShowEditCommentDialog}>
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
