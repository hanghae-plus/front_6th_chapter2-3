import { useState, useEffect } from "react"
import type { Post, UpdatePost } from "@/entities/post/model"
import { Button, Input, Textarea } from "@/shared/ui"
import { useUpdatePost } from "../model/mutations"

interface EditPostDialogProps {
  post: Post | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export const EditPostDialog = ({ post, isOpen, onClose, onSuccess }: EditPostDialogProps) => {
  const [formData, setFormData] = useState<UpdatePost>({
    title: "",
    body: "",
  })

  const updatePostMutation = useUpdatePost()

  // post가 변경될 때마다 폼 데이터 초기화
  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        body: post.body,
      })
    }
  }, [post])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!post || !formData.title?.trim() || !formData.body?.trim()) {
      return
    }

    try {
      await updatePostMutation.mutateAsync({
        id: post.id,
        data: formData,
      })
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error("게시물 수정 실패:", error)
    }
  }

  const handleChange = (field: keyof UpdatePost, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (!isOpen || !post) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">게시물 수정</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="제목"
              value={formData.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              required
            />
          </div>

          <div>
            <Textarea
              rows={15}
              placeholder="내용"
              value={formData.body || ""}
              onChange={(e) => handleChange("body", e.target.value)}
              required
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="submit" disabled={updatePostMutation.isPending}>
              {updatePostMutation.isPending ? "수정 중..." : "게시물 수정"}
            </Button>

            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
