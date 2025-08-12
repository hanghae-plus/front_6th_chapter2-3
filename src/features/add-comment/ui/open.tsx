import { Dialog } from "@/shared/ui"

import type { AddCommentFormValues } from "../model"
import { AddCommentDialog } from "./add-comment-dialog"

import { overlay } from "overlay-kit"

type Options = {
  onSubmit: (formData: AddCommentFormValues) => void
}

export const openAddCommentDialog = (options: Options) => {
  overlay.open(({ isOpen, close }) => (
    <Dialog open={isOpen} onOpenChange={() => isOpen && close()}>
      <AddCommentDialog onSubmit={options.onSubmit} close={close} />
    </Dialog>
  ))
}


