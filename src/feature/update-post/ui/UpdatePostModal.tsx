import { useEffect, useState } from "react"

import { Post } from "@/entities/post"
import { useUpdatePostMutation } from "@/feature/update-post"
import { useModal } from "@/shared/hooks/useModal"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "@/shared/ui"

interface UpdatePostModalProps {
  modalId: string
}

export const UpdatePostModal = ({ modalId }: UpdatePostModalProps) => {
  const { close, data: selectedPost, isOpen } = useModal<Post>(modalId)
  const { isError, isPending, mutate: updatePostMutate } = useUpdatePostMutation()

  const [postData, setPostData] = useState({
    body: "",
    title: "",
  })

  useEffect(() => {
    if (selectedPost) {
      setPostData({
        body: selectedPost.body,
        title: selectedPost.title,
      })
    }
  }, [selectedPost])

  const handleUpdatePost = () => {
    if (selectedPost && postData.title.trim() && postData.body.trim()) {
      updatePostMutate({
        ...selectedPost,
        body: postData.body,
        title: postData.title,
      })
      close()
    }
  }

  const handleClose = () => {
    setPostData({ body: "", title: "" })
    close()
  }

  return (
    <Dialog onOpenChange={handleClose} open={isOpen}>
      <DialogContent aria-label="게시물 수정">
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            onChange={(e) => setPostData({ ...postData, title: e.target.value })}
            placeholder="제목"
            value={postData.title}
          />
          <Textarea
            onChange={(e) => setPostData({ ...postData, body: e.target.value })}
            placeholder="내용"
            rows={15}
            value={postData.body}
          />
          <Button disabled={isPending} onClick={handleUpdatePost}>
            게시물 업데이트
          </Button>
        </div>
        {isError && <div className="text-red-500">게시물 수정에 실패했습니다.</div>}
      </DialogContent>
    </Dialog>
  )
}
