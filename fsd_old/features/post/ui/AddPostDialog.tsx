import { CreatePostBody, useCreatePost } from "@features/post/model/hooks/useCreatePost"
import { Button } from "@shared/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@shared/ui/dialog"
import { Input } from "@shared/ui/input"
import { Textarea } from "@shared/ui/textarea"
import { useState } from "react"

interface AddPostDialogProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export const AddPostDialog = ({ isOpen, onOpenChange }: AddPostDialogProps) => {
  const [newPost, setNewPost] = useState<CreatePostBody>({
    title: "",
    body: "",
    userId: 1,
  })
  // TODO : 추가 후 전역 postsList에 0번째 인덱스에 업데이트 해줘야함
  const { mutate: createPost } = useCreatePost()

  const handleAddPost = () => {
    createPost(newPost)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 게시물 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <Textarea
            rows={30}
            placeholder="내용"
            value={newPost.body}
            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
          />
          <Input
            type="number"
            placeholder="사용자 ID"
            value={newPost.userId}
            onChange={(e) => setNewPost({ ...newPost, userId: Number(e.target.value) })}
          />
          <Button onClick={handleAddPost}>게시물 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
