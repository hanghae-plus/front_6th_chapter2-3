import { AddPostDialog } from "@features/post/components/AddPostDialog"
import { Button } from "@shared/components/button"
import { Plus } from "lucide-react"
import { useState } from "react"

export const AddPostButton = () => {
  const [isOpen, setIsOpen] = useState(false)

  const handleShowAddPostDialog = () => {
    setIsOpen(true)
  }

  return (
    <>
      <Button onClick={handleShowAddPostDialog}>
        <Plus className="w-4 h-4 mr-2" />
        게시물 추가
      </Button>
      <AddPostDialog isOpen={isOpen} onOpenChange={setIsOpen} />
    </>
  )
}
