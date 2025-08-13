import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useDialogActions, useDialogStore } from "@/shared/model/useDialogStore"
import { PostWithAuthor } from "@/shared/types"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "@/shared/ui"
import { postMutations } from "../model/mutations"

interface EditPostDialogProps {
  selectedPost: PostWithAuthor | null
  onUpdate: (post: PostWithAuthor) => void
}

export const EditPostDialog = ({ selectedPost, onUpdate }: EditPostDialogProps) => {
  const queryClient = useQueryClient()

  const isOpen = useDialogStore((state) => state.dialogs.EDIT)
  const { hideDialog } = useDialogActions()

  const updatePostMutation = useMutation(postMutations.update(queryClient, selectedPost?.id ?? 0))

  const handleUpdate = () => {
    updatePostMutation.mutate({
      id: selectedPost?.id ?? 0,
      data: { title: selectedPost?.title ?? "", body: selectedPost?.body ?? "" },
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && hideDialog("EDIT")}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={selectedPost?.title ?? ""}
            onChange={(e) => {
              onUpdate({ ...selectedPost, title: e.target.value } as PostWithAuthor)
            }}
          />
          <Textarea
            rows={15}
            placeholder="내용"
            value={selectedPost?.body ?? ""}
            onChange={(e) => {
              onUpdate({ ...selectedPost, body: e.target.value } as PostWithAuthor)
            }}
          />
          <Button onClick={handleUpdate} disabled={updatePostMutation.isPending}>
            게시물 업데이트
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
