import { Dialog } from "@/shared/ui"
import type { Post } from "@/entities/posts"

import type { PostFormValues } from "../model"
import { UpdatePostDialog } from "./update-post-dialog"

import { overlay } from "overlay-kit"

type Options = {
  post: Post
  onSubmit: (formValues: PostFormValues) => void
}

export const openUpdatePostDialog = (options: Options) => {
  overlay.open(({ isOpen, close }) => (
    <Dialog open={isOpen} onOpenChange={() => isOpen && close()}>
      <UpdatePostDialog post={options.post} onSubmit={options.onSubmit} close={close} />
    </Dialog>
  ))
}


