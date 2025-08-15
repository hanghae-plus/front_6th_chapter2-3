import { Plus } from "lucide-react"

import { DialogType, useDialogStore } from "@/base/lib"
import { Button } from "@/base/ui/Button"

export function AddPostButton() {
  const { openDialog } = useDialogStore((state) => state.actions)

  const handleClick = () => {
    openDialog(DialogType.ADD_POST)
  }

  return (
    <Button onClick={handleClick}>
      <Plus className="mr-2 h-4 w-4" />
      게시물 추가
    </Button>
  )
}
