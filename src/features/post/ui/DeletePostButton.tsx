import { useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/shared/ui"
import { useDeletePost } from "../model/mutations"

interface DeletePostButtonProps {
  postId: number
  onSuccess?: () => void
  variant?: "default" | "ghost" | "outline"
  size?: "default" | "sm" | "lg"
}

export const DeletePostButton = ({ postId, onSuccess, variant = "ghost", size = "sm" }: DeletePostButtonProps) => {
  const [showConfirm, setShowConfirm] = useState(false)
  const deletePostMutation = useDeletePost()

  const handleDelete = async () => {
    try {
      await deletePostMutation.mutateAsync(postId)
      setShowConfirm(false)
      onSuccess?.()
    } catch (error) {
      console.error("게시물 삭제 실패:", error)
    }
  }

  if (showConfirm) {
    return (
      <div className="flex gap-2">
        <Button variant="destructive" size={size} onClick={handleDelete} disabled={deletePostMutation.isPending}>
          {deletePostMutation.isPending ? "삭제 중..." : "확인"}
        </Button>

        <Button variant="outline" size={size} onClick={() => setShowConfirm(false)}>
          취소
        </Button>
      </div>
    )
  }

  return (
    <Button variant={variant} size={size} onClick={() => setShowConfirm(true)} disabled={deletePostMutation.isPending}>
      <Trash2 className="w-4 h-4" />
    </Button>
  )
}
