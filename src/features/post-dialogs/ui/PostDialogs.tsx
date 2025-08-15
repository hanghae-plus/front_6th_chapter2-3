import { useState } from "react"

import { useAddPost } from "@/entities/post/hook/usePost"
import { changePostSearchParams } from "@/entities/post/lib/postSearchUtils"
import { AddPost, PostSearchParams } from "@/entities/post/model"
import { useDialog } from "@/shared/hook/useDialog"
import { Button, Input, Textarea } from "@/shared/ui"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog"

interface PostDialogsProps {
  searchCondition: PostSearchParams
}

export const PostDialogs = ({ searchCondition }: PostDialogsProps) => {
  const { open: openAddPostDialog, isOpen: isAddPostDialogOpen } = useDialog("post-add")

  const [newPost, setNewPost] = useState<AddPost>(() => ({
    title: "",
    body: "",
    userId: 0,
  }))

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPost({ ...newPost, title: e.target.value })
  }
  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewPost({ ...newPost, body: e.target.value })
  }

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPost({ ...newPost, userId: parseInt(e.target.value) })
  }

  const { mutate: addPost } = useAddPost(changePostSearchParams(searchCondition))
  const handleAddPost = () => {
    addPost(newPost, {
      onSuccess: () => {
        openAddPostDialog(null)
        setNewPost({
          title: "",
          body: "",
          userId: 0,
        })
      },
    })
  }

  return (
    <Dialog onOpenChange={openAddPostDialog} open={isAddPostDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 게시물 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input onChange={handleTitleChange} placeholder="제목" value={newPost.title || ""} />
          <Textarea onChange={handleBodyChange} placeholder="내용" rows={30} value={newPost.body || ""} />
          <Input onChange={handleUserIdChange} placeholder="사용자 ID" type="number" value={newPost.userId || ""} />
          <Button onClick={handleAddPost}>게시물 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
