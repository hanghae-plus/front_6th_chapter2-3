import { Textarea, Button } from "../../../shared/ui"
import { Comment } from "../../../entities/comments/api/types"
import { ChangeEvent, useState } from "react"
import { useUpdateComment } from "../model/useUpdateComment"

interface EditCommentFormProps {
  comment: Comment
}

const EditCommentForm = ({ comment }: EditCommentFormProps) => {
  const [updatedCommentBody, setUpdatedCommentBody] = useState(comment?.body || "")
  const { mutate: updateComment } = useUpdateComment()

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setUpdatedCommentBody(e.target.value)
  }

  const handleUpdate = () => {
    updateComment({ id: comment.id, body: updatedCommentBody })
  }

  return (
    <div className="space-y-4">
      <Textarea placeholder="댓글 내용" value={updatedCommentBody || ""} onChange={handleChange} />
      <Button onClick={handleUpdate}>댓글 업데이트</Button>
    </div>
  )
}

export default EditCommentForm
