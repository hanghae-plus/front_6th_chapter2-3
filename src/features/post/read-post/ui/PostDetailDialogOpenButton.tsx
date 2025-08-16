import { MessageSquare } from "lucide-react"
import { Button } from "@/shared/ui"
import { useDialogActions } from "@/shared/model"

interface PostDetailDialogOpenButtonProps {
  onClick: () => void
}

export const PostDetailDialogOpenButton = ({ onClick }: PostDetailDialogOpenButtonProps) => {
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
