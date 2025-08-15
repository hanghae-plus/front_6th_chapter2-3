import { useState } from "react"
import { Input, Textarea, Button } from "../../../shared/ui"

interface AddPostFormProps {
  onAddPost: () => void
}

const AddPostForm = ({ onAddPost }: AddPostFormProps) => {
  const [newPost, setNewPost] = useState({ title: "", body: "", userId: 1 })

  return (
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
      <Button onClick={onAddPost}>게시물 추가</Button>
    </div>
  )
}

export default AddPostForm
