import { useOverlay } from "../../../../shared/hooks/useOverlay"
import { AddPostDialog } from "../ui/AddPostDialog"
import type { CreatePostRequest } from "../../../../entities/post/api/api"

export const useAddPostDialog = () => {
  const { open, overlay } = useOverlay()

  const openAdd = (): Promise<CreatePostRequest | undefined> =>
    open<CreatePostRequest>(({ isOpen, close }) => (
      <AddPostDialog isOpen={isOpen} onClose={() => close()} onConfirm={(data) => close(data)} />
    ))

  return { openAdd, overlay }
}
