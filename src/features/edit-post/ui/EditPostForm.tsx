import { Input, Textarea, Button } from "../../../shared/ui"
import { PostDTO } from "../../../entities/posts/api"
import { ChangeEvent, useState } from "react"
import { useEditPost } from "../model/useEditPost"

interface EditPostFormProps {
  post: PostDTO | null
}

const EditPostForm = ({ post }: EditPostFormProps) => {
  const [updatedPost, setUpdatedPost] = useState(post)
  const { mutate: updatePost } = useEditPost()

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name) {
      setUpdatedPost((prev) => (prev ? { ...prev, [name]: value } : null))
    }
  }

  const handleUpdate = () => {
    if (updatedPost) {
      updatePost(updatedPost)
    }
  }

  return (
    <div className="space-y-4">
      <Input placeholder="제목" name="title" value={updatedPost?.title || ""} onChange={handleChange} />
      <Textarea name="body" rows={15} placeholder="내용" value={updatedPost?.body || ""} onChange={handleChange} />
      <Button onClick={handleUpdate}>게시물 업데이트</Button>
    </div>
  )
}

export default EditPostForm
