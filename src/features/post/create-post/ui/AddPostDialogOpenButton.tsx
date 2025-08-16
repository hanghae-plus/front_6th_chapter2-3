import { Plus } from "lucide-react"
import { Button } from "@/shared/ui"
import { useDialogActions } from "@/shared/model"

export const AddPostDialogOpenButton = () => {
  const { showDialog } = useDialogActions()

  return (
    <Button onClick={() => showDialog("ADD")}>
      <Plus className="w-4 h-4 mr-2" />
      게시물 추가
    </Button>
  )
}
