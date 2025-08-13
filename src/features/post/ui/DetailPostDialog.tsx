import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui"
import { useDialogActions, useDialogStore } from "@/shared/model/useDialogStore"
import { PostWithAuthor } from "@/shared/types"

interface DetailPostDialogProps {
  selectedPost: PostWithAuthor | null
}

export const DetailPostDialog = ({ selectedPost }: DetailPostDialogProps) => {
  const isOpen = useDialogStore((state) => state.dialogs.POST_DETAIL)
  const { hideDialog } = useDialogActions()

  if (!selectedPost) return null

  return (
    <Dialog open={isOpen} onOpenChange={() => hideDialog("POST_DETAIL")}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{selectedPost.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{selectedPost.body}</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
