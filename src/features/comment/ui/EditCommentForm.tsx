import { useState, useEffect } from "react"
import type { Comment, UpdateComment } from "@/entities/comment/model"
import { Button, Textarea } from "@/shared/ui"
import { useUpdateComment } from "../model/mutations"

interface EditCommentFormProps {
  comment: Comment
  onSuccess?: () => void
  onCancel?: () => void
}

export const EditCommentForm = ({ comment, onSuccess, onCancel }: EditCommentFormProps) => {
  const [body, setBody] = useState(comment.body)
  const [isEditing, setIsEditing] = useState(false)

  const updateCommentMutation = useUpdateComment()

  // comment가 변경될 때마다 폼 데이터 초기화
  useEffect(() => {
    setBody(comment.body)
  }, [comment])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!body.trim()) {
      return
    }

    try {
      const updateData: UpdateComment = { body }
      await updateCommentMutation.mutateAsync({
        id: comment.id,
        data: updateData,
      })
      setIsEditing(false)
      onSuccess?.()
    } catch (error) {
      console.error("댓글 수정 실패:", error)
    }
  }

  const handleCancel = () => {
    setBody(comment.body)
    setIsEditing(false)
    onCancel?.()
  }

  if (!isEditing) {
    return (
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
          수정
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        rows={3}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="댓글을 수정하세요..."
        required
      />

      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={updateCommentMutation.isPending}>
          {updateCommentMutation.isPending ? "수정 중..." : "수정 완료"}
        </Button>

        <Button type="button" variant="outline" size="sm" onClick={handleCancel}>
          취소
        </Button>
      </div>
    </form>
  )
}
