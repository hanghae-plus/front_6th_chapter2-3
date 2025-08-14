/* eslint-disable @typescript-eslint/no-explicit-any */

import { DialogType, useDialogStore } from "@/shared/lib"
import { Button, Dialog, Input, Textarea } from "@/shared/ui"

type PostAddDialogProps = {
  addPost: any
  newPost: any
  setNewPost: any
}

export function PostAddDialog({ addPost, newPost, setNewPost }: PostAddDialogProps) {
  const currentDialog = useDialogStore((state) => state.currentDialog)
  const { closeDialog } = useDialogStore((state) => state.actions)
  const isOpen = currentDialog === DialogType.ADD_POST

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>새 게시물 추가</Dialog.Title>
        </Dialog.Header>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={newPost?.title || ""}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <Textarea
            rows={30}
            placeholder="내용"
            value={newPost?.body || ""}
            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
          />
          <Input
            type="number"
            placeholder="사용자 ID"
            value={newPost?.userId || 1}
            onChange={(e) => setNewPost({ ...newPost, userId: Number(e.target.value) })}
          />
          <Button onClick={addPost}>게시물 추가</Button>
        </div>
      </Dialog.Content>
    </Dialog>
  )
}
