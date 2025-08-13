import { useState } from "react"
import type { CreatePost } from "@/entities/post/model"
import { Button, Input, Textarea } from "@/shared/ui"
import { useCreatePost } from "../model/mutations"

interface CreatePostFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export const CreatePostForm = ({ onSuccess, onCancel }: CreatePostFormProps) => {
  const [formData, setFormData] = useState<CreatePost>({
    title: "",
    body: "",
    userId: 1,
  })

  const createPostMutation = useCreatePost()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.body.trim()) {
      return
    }

    try {
      await createPostMutation.mutateAsync(formData)
      setFormData({ title: "", body: "", userId: 1 })
      onSuccess?.()
    } catch (error) {
      console.error("게시물 생성 실패:", error)
    }
  }

  const handleChange = (field: keyof CreatePost, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          placeholder="제목"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          required
        />
      </div>

      <div>
        <Textarea
          rows={15}
          placeholder="내용"
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
        <Button type="submit" disabled={createPostMutation.isPending}>
          {createPostMutation.isPending ? "생성 중..." : "게시물 생성"}
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
