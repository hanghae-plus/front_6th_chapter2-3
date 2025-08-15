import { useDialogStore } from "../../../shared/stores/dialogStore"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "../../../shared/ui"
import { useAddPost } from "./hooks"

export const AddPostForm = () => {
  const { openAddDialog, closeAddDialog } = useDialogStore()
  const {
    newPost,
    setTitle,
    setBody,
    setUserId,
    addPost,
    resetForm,
    isLoading: isAddingPost,
    isError: isAddError,
    error: addError,
  } = useAddPost(() => {
    closeAddDialog()
  })
  const { showAddDialog } = useDialogStore()
  return (
    <Dialog
      open={showAddDialog}
      onOpenChange={(open) => {
        if (open) {
          openAddDialog()
        } else {
          closeAddDialog()
          resetForm()
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 게시물 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="제목" value={newPost.title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea rows={30} placeholder="내용" value={newPost.body} onChange={(e) => setBody(e.target.value)} />
          <Input
            type="number"
            placeholder="사용자 ID"
            value={newPost.userId}
            onChange={(e) => setUserId(Number(e.target.value))}
          />
          <Button onClick={addPost} disabled={isAddingPost}>
            {isAddingPost ? "추가 중..." : "게시물 추가"}
          </Button>
          {isAddError && (
            <p className="text-red-500 text-sm">게시물 추가 중 오류가 발생했습니다: {addError?.message}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
