import { Dialog } from "@/shared/ui"
import type { Post } from "@/entities/posts"

import { PostDetailDialog } from "./post-detail-dialog"

import { overlay } from "overlay-kit"

type Options = {
  post: Post
  onDeleteComment: (commentId: number) => void
  onLikeComment: (commentId: number, likes: number) => void
  searchQuery: string
  onCloseCallback?: () => void
}

export const openPostDetailDialog = (options: Options) => {
  overlay.open(({ isOpen, close }) => (
    <Dialog open={isOpen} onOpenChange={() => {
      if (isOpen) {
        close()
        options?.onCloseCallback?.()
      }
    }}>
      <PostDetailDialog
        post={options.post}
        onDeleteComment={options.onDeleteComment}
        onLikeComment={options.onLikeComment}
        searchQuery={options.searchQuery}
      />
    </Dialog>
  ))
}


