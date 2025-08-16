import { atom, useAtom } from "jotai"

const showAddDialogAtom = atom(false)
const showPostDetailDialogAtom = atom(false)
const showEditDialogAtom = atom(false)

export const usePostDialog = () => {
  const [showAddDialog, setShowAddDialog] = useAtom(showAddDialogAtom)
  const [showPostDetailDialog, setShowPostDetailDialog] = useAtom(showPostDetailDialogAtom)
  const [showEditDialog, setShowEditDialog] = useAtom(showEditDialogAtom)

  return new (class {
    showAddDialog = showAddDialog
    setShowAddDialog = setShowAddDialog

    showEditDialog = showEditDialog
    setShowEditDialog = setShowEditDialog

    showPostDetailDialog = showPostDetailDialog
    setShowPostDetailDialog = setShowPostDetailDialog
  })()
}
