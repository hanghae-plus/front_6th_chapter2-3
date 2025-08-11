import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "@/shared/ui"
import { overlay } from "overlay-kit"
import { useAddCommentForm } from "../hooks"
import { AddCommentFormValues } from "../model"

type Props = {
  onSubmit: (formData: AddCommentFormValues) => void
  close: () => void
}

export const AddCommentDialog = ({ onSubmit, close }: Props) => {
  const addCommentForm = useAddCommentForm()
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>새 댓글 추가</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <Textarea
          placeholder="댓글 내용"
          value={addCommentForm.values.body}
          onChange={(e) => addCommentForm.setBody(e.target.value)}
        />
        <Button
          onClick={() => {
            onSubmit(addCommentForm.values)
            close()
          }}
        >
          댓글 추가
        </Button>
      </div>
    </DialogContent>
  )
}

export const openAddCommentDialog = (options: Omit<Props, "close">) => {
  overlay.open(({ isOpen, close }) => (
    <Dialog open={isOpen} onOpenChange={() => isOpen && close()}>
      <AddCommentDialog onSubmit={options.onSubmit} close={close} />
    </Dialog>
  ))
}
