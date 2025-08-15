import { type ChangeEvent } from "react"

import { usePostDialogStore } from "@/features/get-post/model"
import { useUpdatePostMutation } from "@/features/update-post/api"
import { DialogType, useDialogStore } from "@/shared/lib"
import { Button, Dialog, Input, Textarea } from "@/shared/ui"

export function PostUpdateDialog() {
  const currentDialog = useDialogStore((state) => state.currentDialog)
  const { closeDialog } = useDialogStore((state) => state.actions)
  const { selectedPost } = usePostDialogStore((state) => state)
  const { setSelectedPost } = usePostDialogStore((state) => state.actions)

  const updatePostMutation = useUpdatePostMutation()
  const isOpen = currentDialog === DialogType.EDIT_POST

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!selectedPost) return
    setSelectedPost({ ...selectedPost, title: event.target.value })
  }

  const handleBodyChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (!selectedPost) return
    setSelectedPost({ ...selectedPost, body: event.target.value })
  }

  const handleUpdatePost = async () => {
    if (!selectedPost || !selectedPost.title.trim() || !selectedPost.body.trim()) return

    try {
      await updatePostMutation.mutateAsync({
        id: selectedPost.id,
        title: selectedPost.title,
        body: selectedPost.body,
        userId: selectedPost.userId
      })
      closeDialog()
    } catch (error) {
      console.error("게시물 업데이트 오류:", error)
    }
  }

  if (!selectedPost) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>게시물 수정</Dialog.Title>
          <Dialog.Description></Dialog.Description>
        </Dialog.Header>
        <div className="space-y-4">
          <Input placeholder="제목" value={selectedPost.title} onChange={handleTitleChange} />
          <Textarea rows={15} placeholder="내용" value={selectedPost.body} onChange={handleBodyChange} />
          <Button
            onClick={handleUpdatePost}
            disabled={!selectedPost.title.trim() || !selectedPost.body.trim() || updatePostMutation.isPending}
          >
            {updatePostMutation.isPending ? "업데이트 중..." : "게시물 업데이트"}
          </Button>
        </div>
      </Dialog.Content>
    </Dialog>
  )
}
