import { Button, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "@/shared/ui"
import type { Post } from "@/entities/posts"

import { usePostUpdateForm } from "../hooks"
import type { PostFormValues } from "../model"



type Props = {
  post: Post
  onSubmit: (formValues: PostFormValues) => void
  close: () => void
}

export const UpdatePostDialog = ({ post, onSubmit }: Props) => {
  const updateForm = usePostUpdateForm(post)

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>게시물 수정</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <Input
          placeholder="제목"
          value={updateForm.values.title}
          onChange={(e) => updateForm.setTitle(e.target.value)}
        />
        <Textarea
          rows={15}
          placeholder="내용"
          value={updateForm.values.body}
          onChange={(e) => updateForm.setBody(e.target.value)}
        />
        <Button
          onClick={() => {
            onSubmit(updateForm.values)
            close?.()
          }}
        >
          게시물 업데이트
        </Button>
      </div>
    </DialogContent>
  )
}


