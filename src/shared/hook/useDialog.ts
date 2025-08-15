import { useAtom } from "jotai"

import { createDialogAtom } from "@/shared/atom/dialogAtom"

export const useDialog = (id: string) => {
  const dialogAtom = createDialogAtom(id)
  const [dialog, setDialog] = useAtom(dialogAtom)

  return {
    open: (component: React.ReactNode) => setDialog(component),
    close: () => setDialog(null),
    isOpen: dialog !== null,
    component: dialog,
  }
}
