import { PostFormEdit } from "@/features/post/ui/PostFormEdit.tsx"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui"
import { usePostDialog } from "@/features/post/model/usePostDialog.ts"

export function PostDialogEdit() {
  const { showEditDialog, setShowEditDialog } = usePostDialog()
  return (
    <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <PostFormEdit />
        </div>
      </DialogContent>
    </Dialog>
  )
}
