import { useOverlay } from "../../../../shared/lib/useOverlay"
import { EditPostDialog } from "../ui/EditPostDialog"
import type { Post } from "../../../../entities/post/model"

export const useEditPostDialog = () => {
  const { open, overlay } = useOverlay()

  const openEdit = (post: Post): Promise<Post | undefined> =>
    open<Post>(({ isOpen, close }) => (
      <EditPostDialog isOpen={isOpen} onClose={close} initialPost={post} onConfirm={(p) => close(p)} />
    ))

  return { openEdit, overlay }
}
