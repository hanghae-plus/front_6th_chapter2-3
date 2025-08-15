import { useDialogStore } from "../../../shared/stores/dialogStore"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "../../../shared/ui"
import { useCreateComment } from "../../../entities/comment/model/hooks"

export const AddCommentForm = () => {
  const { openAddCommentDialog, closeAddCommentDialog } = useDialogStore()
  const {
    newComment,
    setBody,
    addComment,
    resetForm,
    isLoading: isAddingComment,
    isError: isAddError,
    error: addError,
  } = useCreateComment(() => {
    closeAddCommentDialog()
  })
  const { showAddCommentDialog } = useDialogStore()

  return (
    <Dialog
      open={showAddCommentDialog}
      onOpenChange={(open) => {
        if (open) {
          openAddCommentDialog()
        } else {
          closeAddCommentDialog()
          resetForm()
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea placeholder="댓글 내용" value={newComment.body} onChange={(e) => setBody(e.target.value)} />
          <Button onClick={addComment} disabled={isAddingComment}>
            {isAddingComment ? "추가 중..." : "댓글 추가"}
          </Button>
          {isAddError && <p className="text-red-500 text-sm">댓글 추가 중 오류가 발생했습니다: {addError?.message}</p>}
        </div>
      </DialogContent>
    </Dialog>
  )
}
