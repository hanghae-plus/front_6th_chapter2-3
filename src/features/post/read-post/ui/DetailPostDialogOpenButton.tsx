import { MessageSquare } from "lucide-react"
import { Button } from "@/shared/ui"
import { useDialogActions } from "@/shared/model"

interface DetailPostDialogOpenButtonProps {
  onClick: () => void
}

export const DetailPostDialogOpenButton = ({ onClick }: DetailPostDialogOpenButtonProps) => {
  const { showDialog } = useDialogActions()

  const handleClick = () => {
    showDialog("POST_DETAIL")
    onClick()
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleClick}>
      <MessageSquare className="w-4 h-4" />
    </Button>
  )
}
