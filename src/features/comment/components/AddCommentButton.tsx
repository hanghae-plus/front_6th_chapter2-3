import { AddCommentDialog } from "@features/comment/components/AddCommentDialog"
import { Button } from "@shared/components/button"
import { Plus } from "lucide-react"
import { useState } from "react"

interface AddCommentButtonProps {
  postId: number
}

export const AddCommentButton = ({ postId }: AddCommentButtonProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleShowAddCommentDialog = () => {
    setIsOpen(true)
  }

  return (
    <>
      <Button size="sm" onClick={handleShowAddCommentDialog}>
        <Plus className="w-3 h-3 mr-1" />
        댓글 추가
      </Button>
      <AddCommentDialog isOpen={isOpen} onOpenChange={setIsOpen} postId={postId} />
    </>
  )
}
