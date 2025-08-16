import { Button } from "@/shared/ui"
import { usePostDialog } from "@/features/post/model/usePostDialog"
import { Plus } from "lucide-react"

export function PostButtonOpenDialogAdd() {
  const { setShowAddDialog } = usePostDialog()

  function handleShowAddDialog() {
    setShowAddDialog(true)
  }

  return (
    <Button onClick={handleShowAddDialog}>
      <Plus className="w-4 h-4 mr-2" />
      게시물 추가
    </Button>
  )
}
