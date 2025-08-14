/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button, Dialog, Textarea } from "@/shared/ui"

type CommentAddDialogProps = {
  showAddCommentDialog: any
  setShowAddCommentDialog: any
  newComment: any
  setNewComment: any
  addComment: any
}

export function CommentAddDialog({
  addComment,
  newComment,
  setNewComment,
  setShowAddCommentDialog,
  showAddCommentDialog,
}: CommentAddDialogProps) {
  return (
    <Dialog open={showAddCommentDialog} onOpenChange={setShowAddCommentDialog}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>새 댓글 추가</Dialog.Title>
        </Dialog.Header>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={newComment.body}
            onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
          />
          <Button onClick={addComment}>댓글 추가</Button>
        </div>
      </Dialog.Content>
    </Dialog>
  )
}
