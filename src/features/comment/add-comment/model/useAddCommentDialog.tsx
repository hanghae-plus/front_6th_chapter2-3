import { useOverlay } from "@shared/lib/useOverlay"
import { AddCommentDialog } from "../ui/AddCommentDialog"

export const useAddCommentDialog = () => {
  const { open, overlay } = useOverlay()

  const openAdd = (): Promise<string | undefined> =>
    open<string>(({ isOpen, close }) => (
      <AddCommentDialog isOpen={isOpen} onClose={close} onConfirm={(body) => close(body)} />
    ))

  return { openAdd, overlay }
}
