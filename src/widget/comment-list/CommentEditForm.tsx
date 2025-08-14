import { useState, useEffect } from "react"
import { Button, Textarea } from "../../shared/ui"
import { useUpdateCommentFeature } from "../../features/comment/update-comments/hooks"
import { Comment, UpdateComment } from "../../entities/comment/model/types"

interface CommentEditFormProps {
  comment: Comment
  onSuccess?: () => void
}

export const CommentEditForm = ({ comment, onSuccess }: CommentEditFormProps) => {
  const [body, setBody] = useState(comment.body)
  const { updateComment } = useUpdateCommentFeature()

  useEffect(() => {
    setBody(comment.body)
  }, [comment.body])

  const handleSubmit = async () => {
    if (!body.trim()) return

    const updateData: UpdateComment = {
      body: body.trim(),
    }

    const result = await updateComment(comment.id, updateData, comment.postId)
    if (result.success) {
      onSuccess?.()
    }
  }

  return (
    <div className="space-y-4">
      <Textarea placeholder="댓글 내용" value={body} onChange={(e) => setBody(e.target.value)} />
      <Button onClick={handleSubmit}>댓글 업데이트</Button>
    </div>
  )
}
