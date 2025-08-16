import { Edit2 } from "lucide-react"
import { Button } from "@/shared/ui"
import { useDialogActions } from "@/shared/model"

interface EditPostDialogOpenButtonProps {
  onClick: () => void
}

export const EditPostDialogOpenButton = ({ onClick }: EditPostDialogOpenButtonProps) => {
  const { showDialog } = useDialogActions()

  const handleClick = () => {
    showDialog("EDIT")
    onClick()
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleClick}>
      <Edit2 className="w-4 h-4" />
    </Button>
  )
}
