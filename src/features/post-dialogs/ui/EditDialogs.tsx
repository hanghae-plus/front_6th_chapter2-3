import { useState } from "react"

import { useUpdatePost } from "@/entities/post/hook/usePost"
import { changePostSearchParams } from "@/entities/post/lib/postSearchUtils"
import { PostSearchParams, PostWithUser, UpdatePost } from "@/entities/post/model"
import { useDialog } from "@/shared/hook/useDialog"
import { Button, Input, Textarea } from "@/shared/ui"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog"

interface EditDialogsProps {
  post: PostWithUser
  searchCondition: PostSearchParams
}

export const EditDialogs = ({ post, searchCondition }: EditDialogsProps) => {
  const { open: openEditDialog, isOpen: isEditDialogOpen } = useDialog("post-edit")

  const [editPost, setEditPost] = useState<UpdatePost>(() => ({
    title: post.title,
    body: post.body,
    id: post.id,
  }))

  const handleEditTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditPost({ ...editPost, title: e.target.value })
  }
  const handleEditBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditPost({ ...editPost, body: e.target.value })
  }

  const { mutate: updatePost } = useUpdatePost(changePostSearchParams(searchCondition))
  const handleUpdatePost = () => {
    updatePost(editPost, {
      onSuccess: () => {
        openEditDialog(null)
        setEditPost({
          title: "",
          body: "",
          id: 0,
        })
      },
    })
  }

  return (
    <Dialog onOpenChange={openEditDialog} open={isEditDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input onChange={handleEditTitleChange} placeholder="제목" value={editPost.title || ""} />
          <Textarea onChange={handleEditBodyChange} placeholder="내용" rows={15} value={editPost.body || ""} />
          <Button onClick={handleUpdatePost}>게시물 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
