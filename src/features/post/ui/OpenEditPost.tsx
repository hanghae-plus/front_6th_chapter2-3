import React from "react"
import { Button } from "../../../shared/ui"
import { Post } from "../../../types"
import { Edit2 } from "lucide-react"
import { useOpenEditPost } from "../model/useOpenEditPost"

interface OpenEditPostProps {
  post: Post
}

export const OpenEditPost: React.FC<OpenEditPostProps> = ({ post }) => {
  const { openEditPost } = useOpenEditPost()

  return (
    <Button variant="ghost" size="sm" onClick={() => openEditPost(post)}>
      <Edit2 className="w-4 h-4" />
    </Button>
  )
}
