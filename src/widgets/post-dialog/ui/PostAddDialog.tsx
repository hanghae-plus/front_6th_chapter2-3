import type { ChangeEvent } from "react"

import { useCreatePostMutation } from "@/features/create-post/api"
import { usePostDialogStore } from "@/features/get-post/model"
import { DialogType, useDialogStore } from "@/shared/lib"
import { Button, Dialog, Input, Textarea } from "@/shared/ui"

export function PostAddDialog() {
  const currentDialog = useDialogStore((state) => state.currentDialog)
  const { closeDialog } = useDialogStore((state) => state.actions)
  const { newPost } = usePostDialogStore((state) => state)
  const { setNewPost, resetNewPost } = usePostDialogStore((state) => state.actions)

  const createPostMutation = useCreatePostMutation()

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

    try {
      await createPostMutation.mutateAsync(newPost)
      closeDialog()
      resetNewPost()
    } catch (error) {
      console.error("게시물 추가 오류:", error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>새 게시물 추가</Dialog.Title>
          <Dialog.Description></Dialog.Description>
        </Dialog.Header>
        <div className="space-y-4">
          <Input placeholder="제목" value={newPost.title} onChange={handleTitleChange} />
          <Textarea rows={30} placeholder="내용" value={newPost.body} onChange={handleBodyChange} />
          <Input type="number" placeholder="사용자 ID" value={newPost.userId} onChange={handleUserIdChange} />
          <Button
            onClick={handleAddPost}
            disabled={!newPost.title.trim() || !newPost.body.trim() || createPostMutation.isPending}
          >
            {createPostMutation.isPending ? "추가 중..." : "게시물 추가"}
          </Button>
        </div>
      </Dialog.Content>
    </Dialog>
  )
}
