import { Dialog } from "@/shared/ui"

import type { AddPostFormValues } from "../model"
import { AddPostDialog } from "./add-post-dialog"

import { overlay } from "overlay-kit"

type Options = {
  onSubmit: (formData: AddPostFormValues) => void
}

export const openAddPostDialog = (options: Options) => {
  overlay.open(({ isOpen, close }) => (
    <Dialog open={isOpen} onOpenChange={() => isOpen && close()}>
      <AddPostDialog onSubmit={options.onSubmit} close={close} />
    </Dialog>
  ))
}


