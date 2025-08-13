import { useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/shared/ui"
import { useDeleteComment } from "../model/mutations"

interface DeleteCommentButtonProps {
  commentId: number
  postId: number
  onSuccess?: () => void
  variant?: "default" | "ghost" | "outline"
  size?: "default" | "sm" | "lg"
}

export const DeleteCommentButton = ({
  commentId,
  postId,
  onSuccess,
  variant = "ghost",
  size = "sm",
}: DeleteCommentButtonProps) => {
  const [showConfirm, setShowConfirm] = useState(false)
  const deleteCommentMutation = useDeleteComment()

  const handleDelete = async () => {
    try {
      await deleteCommentMutation.mutateAsync({ id: commentId, postId })
      setShowConfirm(false)
      onSuccess?.()
    } catch (error) {
      console.error("댓글 삭제 실패:", error)
    }
  }

  if (showConfirm) {
    return (
      <div className="flex gap-2">
        <Button variant="destructive" size={size} onClick={handleDelete} disabled={deleteCommentMutation.isPending}>
          {deleteCommentMutation.isPending ? "삭제 중..." : "확인"}
        </Button>

        <Button variant="outline" size={size} onClick={() => setShowConfirm(false)}>
          취소
        </Button>
      </div>
    )
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => setShowConfirm(true)}
      disabled={deleteCommentMutation.isPending}
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  )
}
