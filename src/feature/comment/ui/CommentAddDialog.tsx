import { useState } from "react"
import { Button, Dialog, Textarea } from "../../../shared/ui"
import { useCommentStore } from "../model/store"
import { NewComment } from "../type"

export const CommentAddDialog = () => {
  const { setComments, showAddCommentDialog, setShowAddCommentDialog } = useCommentStore()
  const [newComment, setNewComment] = useState<NewComment>({ body: "", postId: 0, userId: 1 })

  // 댓글 추가
  const addComment = async () => {
    try {
      const response = await fetch("/api/comments/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment),
      })
      const data = await response.json()
      setComments((prev) => ({
        ...prev,
        [data.postId]: [...(prev[data.postId] || []), data],
      }))

      setShowAddCommentDialog(false)
      setNewComment({ body: "", postId: null, userId: 1 })
    } catch (error) {
      console.error("댓글 추가 오류:", error)
    }
  }

  return (
    <Dialog open={showAddCommentDialog} handleChange={setShowAddCommentDialog} title="새 댓글 추가">
      <div className="space-y-4">
        <Textarea
          placeholder="댓글 내용"
          value={newComment.body}
          onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
        />
        <Button onClick={addComment}>댓글 추가</Button>
      </div>
    </Dialog>
  )
}
