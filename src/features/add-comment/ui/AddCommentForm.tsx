import { useState } from "react"
import { Textarea, Button } from "../../../shared/ui"
import { addCommentApi, Comment } from "../../../entities/comments/api"

type Props = {
  onSubmitSuccess: (data: Comment) => void
}

const AddCommentForm = ({ onSubmitSuccess }: Props) => {
  // TODO: hook으로 분리.
  const [newComment, setNewComment] = useState({ body: "", postId: null, userId: 1 })
  const onAddComment = async () => {
    try {
      const data = await addCommentApi(newComment)

      setNewComment({ body: "", postId: null, userId: 1 })

      onSubmitSuccess(data)
    } catch (error) {
      console.error("댓글 추가 오류:", error)
    }
  }
  return (
    <div className="space-y-4">
      <Textarea
        placeholder="댓글 내용"
        value={newComment.body}
        onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
      />
      <Button onClick={onAddComment}>댓글 추가</Button>
    </div>
  )
}

export default AddCommentForm
