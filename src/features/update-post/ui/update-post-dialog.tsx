import { postSchema } from "@/entities/posts"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "@/shared/ui"
import { overlay } from "overlay-kit"
import { z } from "zod"
import { usePostUpdateForm } from "../hooks"
import { PostFormValues } from "../model"

type Props = {
  post: z.infer<typeof postSchema>
  onSubmit: (formValues: PostFormValues) => void
  close: () => void
}

export const UpdatePostDialog = ({ post, onSubmit }: Props) => {
  const updateForm = usePostUpdateForm(post)

  console.log(updateForm.values)
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

export const openUpdatePostDialog = (options: Omit<Props, "close">) => {
  overlay.open(({ isOpen, close }) => (
    <Dialog open={isOpen} onOpenChange={() => isOpen && close()}>
      <UpdatePostDialog post={options.post} onSubmit={options.onSubmit} close={close} />
    </Dialog>
  ))
}
