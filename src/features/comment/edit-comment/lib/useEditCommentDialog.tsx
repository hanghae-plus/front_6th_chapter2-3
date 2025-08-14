import { useOverlay } from "../../../../shared/hooks/useOverlay"
import { EditCommentDialog } from "../ui/EditCommentDialog"

export const useEditCommentDialog = () => {
  const { open, overlay } = useOverlay()

  const openEdit = (initialBody: string): Promise<string | undefined> =>
    open<string>(({ isOpen, close }) => (
      <EditCommentDialog
        isOpen={isOpen}
        onClose={() => close(undefined)}
        initialBody={initialBody}
        onConfirm={(body) => close(body)}
      />
    ))

  return { openEdit, overlay }
}
