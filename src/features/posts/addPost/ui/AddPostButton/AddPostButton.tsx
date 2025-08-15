import React from "react"
import { Button } from "../../../../../shared/ui"
import { Plus } from "lucide-react"

type Props = {
  onClick: () => void
}
const AddPostButton = ({ onClick }: Props) => {
  return (
    <Button onClick={onClick}>
      <Plus className="w-4 h-4 mr-2" />
      게시물 추가
    </Button>
  )
}

export default AddPostButton
