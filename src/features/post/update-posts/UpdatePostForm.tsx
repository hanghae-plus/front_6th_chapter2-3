import { useState, useEffect } from "react"
import { Button, Input, Textarea } from "../../../shared/ui"
import { useUpdatePost } from "../../../entities/post/model/hooks"
import { PostItem } from "../../../entities/post/model/types"
import { useDialogStore } from "../../../shared/stores/dialogStore"

interface UpdatePostFormProps {
  selectedPost: PostItem
}

export const UpdatePostForm = ({ selectedPost }: UpdatePostFormProps) => {
  const { closeEditDialog } = useDialogStore()

  const [formData, setFormData] = useState({
    title: "",
    body: "",
    userId: 1,
  })

  const updatePostMutation = useUpdatePost(selectedPost.id)

  // selectedPost가 변경될 때마다 formData 업데이트
  useEffect(() => {
    if (selectedPost && selectedPost.title && selectedPost.body) {
      setFormData({
        title: selectedPost.title,
        body: selectedPost.body,
        userId: selectedPost.userId,
      })
    }
  }, [selectedPost])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updatePostMutation.mutateAsync({
        title: formData.title,
        body: formData.body,
        userId: formData.userId,
        reactions: selectedPost.reactions,
        tags: selectedPost.tags || [],
      })

      // 캐시 업데이트는 useUpdatePost 훅에서 자동으로 처리됨
      closeEditDialog()
    } catch (error) {
      console.error("게시물 업데이트 실패:", error)
    }
  }

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input placeholder="제목" value={formData.title} onChange={(e) => handleInputChange("title", e.target.value)} />
      <Textarea
        rows={15}
        placeholder="내용"
        value={formData.body}
        onChange={(e) => handleInputChange("body", e.target.value)}
      />
      <Input
        type="number"
        placeholder="사용자 ID"
        value={formData.userId}
        onChange={(e) => handleInputChange("userId", Number(e.target.value))}
      />
      <Button type="submit" disabled={updatePostMutation.isPending}>
        {updatePostMutation.isPending ? "업데이트 중..." : "게시물 업데이트"}
      </Button>
      {updatePostMutation.isError && (
        <p className="text-red-500 text-sm">
          게시물 업데이트 중 오류가 발생했습니다: {updatePostMutation.error?.message}
        </p>
      )}
    </form>
  )
}
