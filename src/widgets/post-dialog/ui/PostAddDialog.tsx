import { type ChangeEvent, useState } from "react"

import { usePostDialogStore } from "@/features/get-post/model"
import { DialogType, useDialogStore } from "@/shared/lib"
import { Button, Dialog, Input, Textarea } from "@/shared/ui"

export function PostAddDialog() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentDialog = useDialogStore((state) => state.currentDialog)
  const { closeDialog } = useDialogStore((state) => state.actions)
  const { newPost } = usePostDialogStore((state) => state)
  const { setNewPost, resetNewPost } = usePostDialogStore((state) => state.actions)

  const isOpen = currentDialog === DialogType.ADD_POST

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewPost({ title: event.target.value })
  }

  const handleBodyChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setNewPost({ body: event.target.value })
  }

  const handleUserIdChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewPost({ userId: Number(event.target.value) })
  }

  const handleAddPost = async () => {
    if (!newPost.title.trim() || !newPost.body.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/posts/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      })

      if (response.ok) {
        closeDialog()
        resetNewPost()
        window.dispatchEvent(new CustomEvent("refreshPosts"))
      }
    } catch (error) {
      console.error("게시물 추가 오류:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>새 게시물 추가</Dialog.Title>
        </Dialog.Header>
        <div className="space-y-4">
          <Input placeholder="제목" value={newPost.title} onChange={handleTitleChange} />
          <Textarea rows={30} placeholder="내용" value={newPost.body} onChange={handleBodyChange} />
          <Input type="number" placeholder="사용자 ID" value={newPost.userId} onChange={handleUserIdChange} />
          <Button onClick={handleAddPost} disabled={!newPost.title.trim() || !newPost.body.trim() || isSubmitting}>
            {isSubmitting ? "추가 중..." : "게시물 추가"}
          </Button>
        </div>
      </Dialog.Content>
    </Dialog>
  )
}
