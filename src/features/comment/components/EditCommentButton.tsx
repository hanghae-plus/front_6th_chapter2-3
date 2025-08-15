import { Comment } from "@entities/comment/types"
import { EditCommentDialog } from "@features/comment/components/EditCommentDialog"
import { Button } from "@shared/components/button"
import { Edit2 } from "lucide-react"
import { useState } from "react"

interface EditCommentButtonProps {
  comment: Comment
}

export const EditCommentButton = ({ comment }: EditCommentButtonProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)}>
        <Edit2 className="w-3 h-3" />
      </Button>
      <EditCommentDialog isOpen={isOpen} onOpenChange={setIsOpen} comment={comment} />
    </>
  )
}
