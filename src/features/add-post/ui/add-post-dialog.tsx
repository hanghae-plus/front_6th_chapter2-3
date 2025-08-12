/* eslint-disable react-refresh/only-export-components */
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "@/shared/ui"
import type { AddPostFormValues } from "@/features/add-post"

import { useAddPostForm } from "../hooks"

import { overlay } from "overlay-kit"

type Props = {
  onSubmit: (formData: AddPostFormValues) => void
  close: () => void
}

export const AddPostDialog = ({ onSubmit, close }: Props) => {
  const addPostForm = useAddPostForm()
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>새 게시물 추가</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <Input
          placeholder="제목"
          defaultValue={addPostForm.values.title}
          onChange={(e) => addPostForm.setTitle(e.target.value)}
        />
        <Textarea
          rows={30}
          placeholder="내용"
          defaultValue={addPostForm.values.body}
          onChange={(e) => addPostForm.setBody(e.target.value)}
        />
        <Input
          type="number"
          placeholder="사용자 ID"
          defaultValue={addPostForm.values.userId?.toString() || ""}
          onChange={(e) => addPostForm.setUserId(Number(e.target.value))}
        />
        <Button
          onClick={() => {
            onSubmit(addPostForm.values)
            close()
          }}
        >
          게시물 추가
        </Button>
      </div>
    </DialogContent>
  )
}

export const openAddPostDialog = (options: Omit<Props, "close">) => {
  overlay.open(({ isOpen, close }) => (
    <Dialog open={isOpen} onOpenChange={() => isOpen && close()}>
      <AddPostDialog onSubmit={options.onSubmit} close={close} />
    </Dialog>
  ))
}
