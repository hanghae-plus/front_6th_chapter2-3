import { Dialog } from "@/shared/ui"

import { UserInfoDialog } from "./user-info-dialog"

import { overlay } from "overlay-kit"

type Options = {
  userId: number
}

export const openUserInfoDialog = (options: Options) => {
  overlay.open(({ isOpen, close }) => (
    <Dialog open={isOpen} onOpenChange={() => !!isOpen && close()}>
      <UserInfoDialog userId={options.userId} />
    </Dialog>
  ))
}


