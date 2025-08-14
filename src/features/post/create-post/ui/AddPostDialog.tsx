import { useState } from "react"
import { CreatePost } from "@/entities/post/model/types"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "@/shared/ui"
import { useDialogActions, useDialogStore } from "@/shared/model/useDialogStore"
import { useCreatePost } from "../model"

export const AddPostDialog = () => {
  const { createPost } = useCreatePost()

  const isOpen = useDialogStore((state) => state.dialogs.ADD)
  const { hideDialog } = useDialogActions()

  const [newPost, setNewPost] = useState<CreatePost>({
    title: "",
    body: "",
    userId: 1,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!newPost.title.trim() || !newPost.body.trim()) {
      alert("제목과 내용을 모두 입력해주세요.")
      return
    }

    setIsSubmitting(true)
    try {
      await createPost(newPost)
      // 성공 시 폼 초기화
      setNewPost({ title: "", body: "", userId: 1 })
      hideDialog("ADD")
    } catch (error) {
      console.error("게시물 추가 실패:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setNewPost({ title: "", body: "", userId: 1 })
    hideDialog("ADD")
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && hideDialog("ADD")}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>새 게시물 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              제목
            </label>
            <Input
              id="title"
              placeholder="게시물 제목을 입력하세요"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="body" className="block text-sm font-medium mb-2">
              내용
            </label>
            <Textarea
              id="body"
              rows={15}
              placeholder="게시물 내용을 입력하세요"
              value={newPost.body}
              onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="userId" className="block text-sm font-medium mb-2">
              사용자 ID
            </label>
            <Input
              id="userId"
              type="number"
              placeholder="사용자 ID"
              value={newPost.userId}
              onChange={(e) => setNewPost({ ...newPost, userId: Number(e.target.value) })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              취소
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "추가 중..." : "게시물 추가"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
