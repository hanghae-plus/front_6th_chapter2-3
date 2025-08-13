import { useState } from "react"
import type { CreateComment } from "@/entities/comment/model"
import { Button, Input, Textarea } from "@/shared/ui"
import { useCreateComment } from "../model/mutations"

interface CreateCommentFormProps {
  postId: number
  onSuccess?: () => void
  onCancel?: () => void
}

export const CreateCommentForm = ({ postId, onSuccess, onCancel }: CreateCommentFormProps) => {
  const [formData, setFormData] = useState<CreateComment>({
    body: "",
    postId,
    userId: 1,
  })

  const createCommentMutation = useCreateComment()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.body.trim()) {
      return
    }

    try {
      await createCommentMutation.mutateAsync(formData)
      setFormData({ body: "", postId, userId: 1 })
      onSuccess?.()
    } catch (error) {
      console.error("댓글 생성 실패:", error)
    }
  }

  const handleChange = (field: keyof CreateComment, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Textarea
          rows={4}
          placeholder="댓글을 작성하세요..."
          value={formData.body}
          onChange={(e) => handleChange("body", e.target.value)}
          required
        />
      </div>

      <div>
        <Input
          type="number"
          placeholder="사용자 ID"
          value={formData.userId}
          onChange={(e) => handleChange("userId", Number(e.target.value))}
          min={1}
          required
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={createCommentMutation.isPending}>
          {createCommentMutation.isPending ? "댓글 작성 중..." : "댓글 작성"}
        </Button>

        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            취소
          </Button>
        )}
      </div>
    </form>
  )
}
