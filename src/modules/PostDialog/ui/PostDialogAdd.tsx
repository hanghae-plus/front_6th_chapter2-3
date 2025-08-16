import { PostFormAdd } from "@/features/post/ui/PostFormAdd.tsx"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui"
import { usePostDialog } from "@/features/post/model/usePostDialog.ts"

export function PostDialogAdd() {
  const { showAddDialog, setShowAddDialog } = usePostDialog()

  return (
    <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 게시물 추가</DialogTitle>
        </DialogHeader>
        <PostFormAdd />
      </DialogContent>
    </Dialog>
  )
}
