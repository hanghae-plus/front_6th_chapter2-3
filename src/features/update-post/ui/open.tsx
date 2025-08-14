import { Dialog } from "@/shared/ui"
import type { Post } from "@/entities/posts"

import type { PostFormValues } from "../model"
import { UpdatePostDialog } from "./update-post-dialog"

import { overlay } from "overlay-kit"

type Options = {
  post: Post
  onSubmit: (formValues: PostFormValues) => void
  onCloseCallback?: () => void
}

export const openUpdatePostDialog = (options: Options) => {
  overlay.open(({ isOpen, close }) => (
    <Dialog open={isOpen} onOpenChange={() => {
      if (isOpen) {
        close()
        options?.onCloseCallback?.()
      }
    }}>
      <UpdatePostDialog post={options.post} onSubmit={options.onSubmit} close={close} />
    </Dialog>
  ))
}


