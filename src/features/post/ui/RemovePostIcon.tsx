import React from "react"
import { Button } from "../../../shared/ui"
import { Trash2 } from "lucide-react"
import { useRemovePost } from "../model/useRemovePost"

interface RemovePostIconProps {
  postId: number
}

export const RemovePostIcon: React.FC<RemovePostIconProps> = ({ postId }) => {
  const { removePost } = useRemovePost()

  return (
    <Button variant="ghost" size="sm" onClick={() => removePost(postId)}>
      <Trash2 className="w-4 h-4" />
    </Button>
  )
}
