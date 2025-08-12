import { Button, DialogContent, DialogHeader, DialogTitle, Textarea } from "@/shared/ui"

import { useUpdateCommentForm } from "../hooks"
import type { UpdateCommentFormValues } from "../model"

type Props = {
  comment: UpdateCommentFormValues
  onSubmit: (formValues: UpdateCommentFormValues) => void
  close: () => void
}

export const UpdateCommentDialog = ({ comment, onSubmit, close }: Props) => {
  const updateCommentForm = useUpdateCommentForm(comment)
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>댓글 수정</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <Textarea
          rows={15}
          placeholder="댓글 내용"
          value={updateCommentForm.values.body}
          onChange={(e) => updateCommentForm.setBody(e.target.value)}
        />
        <Button
          onClick={() => {
            onSubmit(updateCommentForm.values)
            close()
          }}
        >
          댓글 업데이트
        </Button>
      </div>
    </DialogContent>
  )
}

 
