import { useOverlay } from "@shared/lib"
import type { Post } from "@entities/post/model"
import { PostDetailDialog } from "../ui/PostDetailDialog"

export const usePostDetailDialog = () => {
  const { open, overlay } = useOverlay()

  const openDetail = (post: Post, searchQuery: string) =>
    open<void>(({ isOpen, close }) => (
      <PostDetailDialog isOpen={isOpen} onClose={close} post={post} searchQuery={searchQuery} />
    ))

  return { openDetail, overlay }
}
