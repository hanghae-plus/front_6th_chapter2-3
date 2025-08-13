import React from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@shared/ui"
import { useRemovePost } from "@/features/remove-post/model/use-remove-post"

interface RemovePostButtonProps {
  postId: number
  onDeleted?: () => void
  size?: "sm" | "default" | "lg" | "icon"
}

export const RemovePostButton: React.FC<RemovePostButtonProps> = ({ postId, onDeleted, size = "sm" }) => {
  const { handleRemove, isLoading } = useRemovePost()

  const handleClick = () => {
    handleRemove(postId, {
      onSuccess: () => onDeleted?.(),
      onError: (err) => console.error("게시물 삭제 오류:", err),
    })
  }

  return (
    <Button variant="ghost" size={size} onClick={handleClick} disabled={isLoading}>
      <Trash2 className="w-4 h-4" />
    </Button>
  )
}
