import { Textarea, Button } from "../../../shared/ui"
import { Comment } from "../../../entities/comments/api/types"
import { ChangeEvent, useState } from "react"

interface EditCommentFormProps {
  comment: Comment
  onUpdateComment: (comment: Comment) => void
}

const EditCommentForm = ({ comment, onUpdateComment }: EditCommentFormProps) => {
  const [updatedCommentBody, setUpdatedCommentBody] = useState(comment?.body || "")

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setUpdatedCommentBody(e.target.value)
  }
  return (
    <div className="space-y-4">
      <Textarea placeholder="댓글 내용" value={updatedCommentBody || ""} onChange={handleChange} />
      <Button onClick={() => onUpdateComment({ ...comment, body: updatedCommentBody })}>댓글 업데이트</Button>
    </div>
  )
}

export default EditCommentForm
