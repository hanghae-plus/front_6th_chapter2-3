import { Dialog } from "@/shared/ui"

import type { UpdateCommentFormValues } from "../model"
import { UpdateCommentDialog } from "./update-comment-dialog"

import { overlay } from "overlay-kit"

type Options = {
  comment: UpdateCommentFormValues
  onSubmit: (formValues: UpdateCommentFormValues) => void
}

export const openUpdateCommentDialog = (options: Options) => {
  overlay.open(({ isOpen, close }) => (
    <Dialog open={isOpen} onOpenChange={() => isOpen && close()}>
      <UpdateCommentDialog comment={options.comment} onSubmit={options.onSubmit} close={close} />
    </Dialog>
  ))
}


