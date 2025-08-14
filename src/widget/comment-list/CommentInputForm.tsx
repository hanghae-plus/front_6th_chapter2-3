import { useState } from "react"
import { Button, Textarea } from "../../shared/ui"
import { useAddComment } from "../../features/comment/add-comments/hooks"
import { CreateComment } from "../../entities/comment/model/types"

interface CommentInputFormProps {
  postId: number
  userId: number
  onSuccess?: () => void
  onCancel?: () => void
}

export const CommentInputForm = ({ postId, userId, onSuccess, onCancel }: CommentInputFormProps) => {
  const [body, setBody] = useState("")
  const { addComment, isLoading } = useAddComment()

  const handleSubmit = async () => {
    if (!body.trim()) return

    const comment: CreateComment = {
      body: body.trim(),
      postId,
      userId,
    }

    const result = await addComment(comment)
    if (result.success) {
      setBody("")
      onSuccess?.()
    }
  }

  const handleCancel = () => {
    setBody("")
    onCancel?.()
  }

  return (
    <div className="space-y-3">
      <Textarea
        placeholder="댓글을 입력하세요..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="min-h-[80px]"
      />
      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            취소
          </Button>
        )}
        <Button onClick={handleSubmit} disabled={!body.trim() || isLoading}>
          {isLoading ? "추가 중..." : "댓글 추가"}
        </Button>
      </div>
    </div>
  )
}
