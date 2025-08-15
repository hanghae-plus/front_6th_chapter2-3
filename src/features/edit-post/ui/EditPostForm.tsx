import { Input, Textarea, Button } from "../../../shared/ui"
import { PostDTO } from "../../../entities/posts/api"
import { ChangeEvent, useState } from "react"

interface EditPostFormProps {
  post: PostDTO | null
  onUpdatePost: (updatedPost: PostDTO | null) => void
}

const EditPostForm = ({ post, onUpdatePost }: EditPostFormProps) => {
  const [updatedPost, setUpdatedPost] = useState(post)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.target.name as "title" | "body"
    const value = e.target.value

    if (name) setUpdatedPost((prev) => ({ ...prev, [name]: value }))
  }
  return (
    <div className="space-y-4">
      <Input placeholder="제목" name="title" value={updatedPost?.title || ""} onChange={handleChange} />
      <Textarea name="body" rows={15} placeholder="내용" value={updatedPost?.body || ""} onChange={handleChange} />
      <Button onClick={() => onUpdatePost(updatedPost)}>게시물 업데이트</Button>
    </div>
  )
}

export default EditPostForm
