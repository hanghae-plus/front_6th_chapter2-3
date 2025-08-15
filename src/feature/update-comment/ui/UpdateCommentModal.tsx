import { useEffect, useState } from "react"

import { Comment } from "@/entities/comment"
import { useUpdateCommentMutation } from "@/feature/update-comment"
import { useModal } from "@/shared/hooks/useModal"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "@/shared/ui"

interface Props {
  modalId: string
}

export const UpdateCommentModal = ({ modalId }: Props) => {
  const { close, data: selectedComment, isOpen } = useModal<Comment>(modalId)
  const { isError, isPending, mutate: updateCommentMutate } = useUpdateCommentMutation()
  const [commentBody, setCommentBody] = useState("")

  useEffect(() => {
    if (selectedComment) {
      setCommentBody(selectedComment.body)
    }
  }, [selectedComment])

  const handleUpdateComment = () => {
    if (selectedComment && commentBody.trim()) {
      updateCommentMutate({
        ...selectedComment,
        body: commentBody,
      })
      close()
    }
  }

  const handleClose = () => {
    setCommentBody("")
    close()
  }

  return (
    <Dialog onOpenChange={handleClose} open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea onChange={(e) => setCommentBody(e.target.value)} placeholder="댓글 내용" value={commentBody} />
          <Button disabled={isPending} onClick={handleUpdateComment}>
            댓글 업데이트
          </Button>
        </div>
        {isError && <div className="text-red-500">댓글 수정에 실패했습니다.</div>}
      </DialogContent>
    </Dialog>
  )
}
