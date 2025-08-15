import { useState } from "react"

import { useAddCommentMutation } from "@/feature/add-comment"
import { useModal } from "@/shared/hooks/useModal"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "@/shared/ui"

interface Props {
  modalId: string
}

export const AddCommentModal = ({ modalId }: Props) => {
  const { close, data, isOpen } = useModal<{ postId: number }>(modalId)
  const { isError, mutate: addCommentMutate } = useAddCommentMutation()
  const [commentBody, setCommentBody] = useState("")

  const handleAddComment = () => {
    if (data?.postId && commentBody.trim()) {
      addCommentMutate({
        body: commentBody,
        postId: data.postId,
        userId: 1,
      })
      setCommentBody("")
      close()
    }
  }

  const handleClose = () => {
    setCommentBody("")
    close()
  }

  return (
    <Dialog onOpenChange={handleClose} open={isOpen}>
      <DialogContent aria-label="새 댓글 추가">
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea onChange={(e) => setCommentBody(e.target.value)} placeholder="댓글 내용" value={commentBody} />
          <Button onClick={handleAddComment}>댓글 추가</Button>
        </div>
        {isError && <div className="text-red-500">댓글 추가에 실패했습니다.</div>}
      </DialogContent>
    </Dialog>
  )
}
